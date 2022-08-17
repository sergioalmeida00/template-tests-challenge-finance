import { app } from "../../../../app";
import request from "supertest";
import createConnection from '../../../../database';
import { Connection } from "typeorm";
import {v4 as uuidv4 } from "uuid";

let connection:Connection;

let Iuser :{
    id:string;
    name:string;
    email:string;
    password:string;
}

describe("Get Statement Operation", ()=>{
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

    it("Should list the operation", async ()=>{
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email:Iuser.email,
            password:Iuser.password
        });

        expect(responseToken.status).toBe(200);
        expect(responseToken.body).toHaveProperty("token");

        const {token} = responseToken.body;

        const responseStatementDeposit = await request(app).post("/api/v1/statements/deposit").send({
            amount:700,
            description:"Immobile"
        }).set({
            Authorization: `Bearer ${token}`
        });

        const responseStatementWithdraw = await request(app).post("/api/v1/statements/withdraw").send({
            amount: 300,
            description: "Loan"
        }).set({
            Authorization: `Bearer ${token}`
        });

        expect(responseStatementDeposit.status).toBe(201);
        expect(responseStatementDeposit.body).toHaveProperty("id");
        expect(responseStatementWithdraw.status).toBe(201);
        expect(responseStatementWithdraw.body).toHaveProperty("id");

        const responseGetOperation = await request(app)
        .get(`/api/v1/statements/${responseStatementDeposit.body.id}`).set({
            Authorization: `Bearer ${token}`
        });

        expect(responseGetOperation.status).toBe(200);
        expect(responseGetOperation.body.id).toEqual(responseStatementDeposit.body.id);
        expect(responseGetOperation.body.type).toEqual('deposit');
        
    });

    it("should be not able to get statement from non-existing user", async ()=>{
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email:'test@test.com.br',
            password:'qwe123'
        });

        expect(responseToken.status).toBe(401);        
        expect(responseToken.body.message).toEqual("Incorrect email or password");

        const {token} = responseToken.body;
        const statement_id = uuidv4();

        const response = await request(app).get(`/api/v1/statements/${statement_id}`)
        .set({
            Authorization: `Bearer ${token}`
        });
        

        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("JWT invalid token!");
    });

    it("should be not able to get non-existing statement", async ()=>{
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email:Iuser.email,
            password:Iuser.password
        });

        expect(responseToken.status).toBe(200);
        const {token} =responseToken.body;

        const statement_id = uuidv4();

        const response = await request(app).get(`/api/v1/statements/${statement_id}`).set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("Statement not found");
    });
});