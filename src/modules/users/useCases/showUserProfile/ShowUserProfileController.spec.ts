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

describe("Show User Profile", ()=>{
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

    it("should be able to list user's profile", async ()=>{
        const responseToken = await request(app).post('/api/v1/sessions').send({
            email:Iuser.email,
            password:Iuser.password
        });
        expect(responseToken.status).toBe(200);
        expect(responseToken.body).toHaveProperty("token");
        const {token} = responseToken.body;

        const response = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toEqual(Iuser.email);
    });

    it("should not be able to list non-existing user's profile", async ()=>{
        const responseToken = await request(app).post('/api/v1/sessions').send({
            email:Iuser.email,
            password:'test543'
        });

        expect(responseToken.status).toBe(401);
        const {token} = responseToken.body

        const response = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("JWT invalid token!");

    });
})