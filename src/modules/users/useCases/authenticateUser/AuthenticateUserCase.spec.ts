import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let inMemoryUsersRepository:InMemoryUsersRepository;
let authenticateUserUseCase:AuthenticateUserUseCase;
let createUserUseCase:CreateUserUseCase;

describe("Authenticate User", () =>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to authenticate an user",async ()=>{
        const user: ICreateUserDTO = {
            email:'sergioalmeidaa00@gmail.com',
            name:'Ségio Almeida',
            password:'1234'
        }

        await createUserUseCase.execute(user);

        const resultUserAuthenticate = await authenticateUserUseCase.execute({
            email:user.email,
            password:user.password
        });
        
        expect(resultUserAuthenticate).toHaveProperty("token");
        
    });

    it("should not be able to authenticate an non existent user",async () => {  
        expect(async ()=>{
            await authenticateUserUseCase.execute({
                email:"teste@teste.com.br",
                password:"1234"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not be able to authenticate with incorrect password", async () =>{
        expect(async ()=>{
            const user:ICreateUserDTO ={
                email:'sergioalmeidaa00@gmail.com',
                name:'Sérgio Almeida',
                password: '1234'
            }

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email:user.email,
                password:'incorretTest'
            });

        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

});