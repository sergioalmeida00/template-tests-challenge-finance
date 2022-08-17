import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { compare } from "bcryptjs";

let userRepositoryInMemory:InMemoryUsersRepository;
let showProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase:CreateUserUseCase;

describe("Show user's Profile", ()=>{
    //Initial repository in memory;
    beforeEach(()=>{
        userRepositoryInMemory = new InMemoryUsersRepository();
        showProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    });

    it("should be able to list user's profile", async ()=>{
        const user = {
            name:"Sérgio Almeida",
            email:"sergioalmeidaa00@gmail.com",
            password:"123"
        }

        const userCreated = await createUserUseCase.execute({
            name:user.name,
            email:user.email,
            password:user.password
        });

        const listUser = await showProfileUseCase.execute(userCreated.id as string);
        const passwordMatch = await compare(user.password, listUser.password);
        
        expect(userCreated).toHaveProperty("id");                
        expect(listUser).toHaveProperty("id");
        expect(listUser.email).toEqual(user.email);
        expect(listUser.name).toEqual(user.name);
        expect(passwordMatch).toBe(true);

    });

    it("Should not be able to list un-existing user's profile", async ()=>{
        expect(async () =>{
            
            const user_id = "oiuwqer09890123";
            await showProfileUseCase.execute(user_id);

        }).rejects.toBeInstanceOf(ShowUserProfileError);
    })

});