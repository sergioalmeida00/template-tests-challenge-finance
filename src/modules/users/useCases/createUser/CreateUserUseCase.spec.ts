import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let inMemoryUsersRepository:InMemoryUsersRepository;
let createUserUseCase:CreateUserUseCase;

describe("Create User",()=>{

    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to create a new user", async()=>{
        const user = {
            name:"sergioAlmeida",
            email:"sergioalmeidaa@gmail.com",
            password:"12345"
        }

        const userCreated = await createUserUseCase.execute({
            name:user.name,
            email:user.email,
            password:user.password
        });

        expect(userCreated).toHaveProperty("id");
    });

    it("should not be able to create a new user with email that already exists", async()=>{
        expect(async()=>{
            const user = {
                name:"sergioAlmeida",
                email:"sergioalmeidaa@gmail.com",
                password:"12345"
            }
    
            await createUserUseCase.execute({
                name:user.name,
                email:user.email,
                password:user.password
            });
    
            await createUserUseCase.execute({
                name:user.name,
                email:user.email,
                password:user.password
            });
        }).rejects.toBeInstanceOf(CreateUserError);    
    });
});