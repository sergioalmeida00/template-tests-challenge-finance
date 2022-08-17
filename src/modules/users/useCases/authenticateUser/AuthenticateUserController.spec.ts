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

describe("Authenticate User",()=>{
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

      it("should be able to authenticate user",async ()=>{
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email:Iuser.email,
            password:Iuser.password
        });
        const {token} = responseToken.body;

        
        expect(responseToken.status).toBe(200);
        expect(responseToken.body).toHaveProperty("token");
        expect(responseToken.body.user.email).toEqual(Iuser.email);
        expect(token).not.toBeUndefined()

        
      });

      it("should not be able to authenticate a non-existing user", async ()=>{
        
            const response = await request(app).post("/api/v1/sessions").send({
                email:'test@test.com.br',
                password:Iuser.password
            });
            expect(response.status).toBe(401);
            expect(response.body.message).toEqual("Incorrect email or password");
            expect(response.body.token).toBe(undefined);            
      });

      it("should not be able to authenticate user with wrong password", async ()=>{
        const response = await request(app).post("/api/v1/sessions").send({
            email:Iuser.email,
            password:'test123'
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("Incorrect email or password");
        expect(response.body.token).toBe(undefined);   

      });
});