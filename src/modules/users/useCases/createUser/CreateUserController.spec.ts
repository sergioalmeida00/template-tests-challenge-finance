import { app } from "../../../../app";
import request from "supertest";
import createConnection from '../../../../database';
import { Connection } from "typeorm";

let connection:Connection;

describe("Create new User", ()=>{

    beforeAll(async ()=>{
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
      });
    
      it("should be able to create user", async ()=>{
        const responseUser = await request(app).post('/api/v1/users').send({
            name:"test",
            email:"tet@test.com",
            password:"123456"
        });

        expect(responseUser.status).toBe(201);
        expect(responseUser.body).toHaveProperty("id");
        expect(responseUser.body.email).toEqual("tet@test.com");
        expect(responseUser.body.name).toEqual("test")

      });

      it("should not be able to create user with same email", async ()=>{
        await request(app).post('/api/v1/users').send({
            name:"test",
            email:"tet@test.com",
            password:"123456"
        });

        const responseUser = await request(app).post('/api/v1/users').send({
            name:"test",
            email:"tet@test.com",
            password:"123456"
        });

        expect(responseUser.status).toBe(400);
        expect(responseUser.body.message).toEqual('User already exists');

      });
});
