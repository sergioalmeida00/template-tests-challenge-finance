import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { GetBalanceError } from "./GetBalanceError";


let inMemoryStatementsRepository:InMemoryStatementsRepository;
let inMemoryUsersRepository:InMemoryUsersRepository;
let getBalanceUseCase:GetBalanceUseCase;
let createUserUseCase:CreateUserUseCase;
let createStatementUseCase:CreateStatementUseCase;

describe("Get Balance", ()=>{
    beforeEach(()=>{
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to get balance", async () =>{
        const user:ICreateUserDTO = {
            email:'sergioalmeidaa00@gmail.com',
            name:'Sergio Almeida',
            password:'1234'
        }

        const userCreated = await createUserUseCase.execute(user);

        expect(userCreated).toHaveProperty("id");

        const user_id = userCreated.id as string;
        
        await createStatementUseCase.execute({
            user_id,
            amount:200,
            description:'Teste',
            type:"deposit" as OperationType
        });

        const balance = await getBalanceUseCase.execute({user_id});


        expect(balance.statement[0]).toHaveProperty("id");
        expect(balance.statement.length).toBe(1);
        expect(balance.balance).toEqual(200);

    });

    it("should not be able to get balance from non-existing user", async ()=>{
        expect(async()=>{
            const user_id = 'test123';
            await getBalanceUseCase.execute({user_id});
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
});