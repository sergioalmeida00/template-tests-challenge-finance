import { app } from "../../../../app";
import request from "supertest";
import createConnection from '../../../../database';
import { Connection } from "typeorm";

let connection:Connection;

let Iuser :{
    id:string;
    name:string;
    email:string;
    password:string;
}

describe("Get Balance Statement", () =>{
    beforeAll(async ()=>{
        connection = await createConnection();
        await connection.runMigrations();

        const userCreated = await request(app).post("/api/v1/users").send({
            name:'almeida',
            email:'almeidateste@gmail.com',
            password:'qwe123'
        });

        Iuser = {
            email:userCreated.body.email,
            name:userCreated.body.name,
            password:'qwe123',
            id: userCreated.body.id
        }

    });

    afterAll(async ()=>{
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should list balance", async ()=>{
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email:Iuser.email,
            password:Iuser.password
        });

        const {token} = responseToken.body;

        await request(app).post("/api/v1/statements/deposit").send({
            amount:100,
            description:"Immobile"
        }).set({
            Authorization: `Bearer ${token}`
        });

        await request(app).post("/api/v1/statements/withdraw").send({
            amount: 50,
            description: "Loan"
        }).set({
            Authorization: `Bearer ${token}`
        })

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer ${token}`
        });     

        expect(response.status).toBe(200);
        expect(response.body.balance).toBe(50);
        expect(response.body.statement[0]).toHaveProperty("id");        

    });

    it("should not be able to get balance from non-existing user",async () =>{
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email:"teste@teste.com",
            password:"qwe123"
        });

        const {token} = responseToken.body;

        expect(responseToken.body.message).toEqual("Incorrect email or password");
        expect(responseToken.status).toBe(401);

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer ${token}`
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("JWT invalid token!");
        
    });
});