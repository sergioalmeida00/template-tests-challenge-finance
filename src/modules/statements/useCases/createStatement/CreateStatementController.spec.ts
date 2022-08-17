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

describe("Create Statement Controller - Integration", ()=>{

    beforeAll(async () =>{
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

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
      });

    it("Should be able to create a new Statement Deposit", async ()=>{

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: Iuser.email,
            password:Iuser.password
        });
        
        const{token} = responseToken.body;

        const response = await request(app).post("/api/v1/statements/deposit").send({
            amount:700,
            description:"Immobile"
        }).set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.type).toEqual("deposit");
    });

    it("Should be able to create a new Statement withdraw", async () => {
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email:Iuser.email,
            password:Iuser.password
        });

        const {token} = responseToken.body;

        const responseWithdraw = await request(app).post("/api/v1/statements/withdraw").send({
            amount:300,
            description:"Loan"
        }).set({
            Authorization: `Bearer ${token}`
        });

        expect(responseWithdraw.status).toBe(201);
        expect(responseWithdraw.body).toHaveProperty("id");
        expect(responseWithdraw.body.type).toEqual("withdraw");
        expect(responseWithdraw.body.amount).toBe(300);

    });

    it("should not be able to deposit/withdraw with non-existing user",async ()=>{
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email:'test@test.com',
            password:'123'
        });

        expect(responseToken.status).toBe(401);
        expect(responseToken.body.message).toEqual("Incorrect email or password");
        expect(responseToken.body.token).toBe(undefined);

        const {token} = responseToken.body;

        const response = await request(app).post("/api/v1/statements/deposit").send({
            amount:700,
            description:"Immobile"
        }).set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("JWT invalid token!");
    });

    it("should not be able to withdraw without money", async ()=>{

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email:Iuser.email,
            password:Iuser.password
        });
        const {token} = responseToken.body;

        const response = await request(app).post("/api/v1/statements/withdraw").send({
            amount:800,
            description:"Loan"
        }).set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Insufficient funds");      

    });




});