import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { OperationType } from "../../entities/Statement";
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryUsersRepository:InMemoryUsersRepository;
let inMemoryStatementsRepository:InMemoryStatementsRepository;
let createUserUseCase:CreateUserUseCase;
let createStatementUseCase:CreateStatementUseCase;
let getStatementOperationUseCase:GetStatementOperationUseCase;

describe("Get Operation", ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
        
    });

    it("should be able to get statement", async ()=>{
        const user:ICreateUserDTO = {
            email:'sergioalmeidaa00@gmail.com',
            name:'Sérgio Almeida',
            password:'qwe123'
        }

        const userCreated = await createUserUseCase.execute(user);
        expect(userCreated).toHaveProperty("id");
        const user_id = userCreated.id as string;

        const deposit:ICreateStatementDTO ={
            amount:100,
            description:'Test Get Operation',
            type:'deposit' as OperationType,
            user_id
        }
        const statementCreated = await createStatementUseCase.execute(deposit);
        expect(statementCreated).toHaveProperty("id");
        const statement_id = statementCreated.id as string;

        const resultStatement = await getStatementOperationUseCase.execute({
            user_id,
            statement_id
        });
        
        expect(resultStatement).toHaveProperty("id");
        expect(resultStatement.amount).toEqual(deposit.amount);
        expect(resultStatement.type).toEqual(deposit.type);
        expect(resultStatement.user_id).toEqual(user_id);
    });

    it("should be not able to get statement from non-existing user", async () =>{
        expect(async () =>{
            const user_id = 'askjdhf';
            const statement_id = 'ioyuioysfd';

            await getStatementOperationUseCase.execute({
                user_id,
                statement_id
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
        
    });

    it("should be not able to get non-existing statement", async () => {
        expect(async () => {
            const user:ICreateUserDTO = {
                email:'sergioalmeidaa00@gmail.com',
                name:'sergio',
                password:'123456'
            }

            const userResult = await createUserUseCase.execute(user);
            expect(userResult).toHaveProperty("id");
            const user_id = userResult.id as string;

            const statement_id = 'test-test';

           const resultNovo = await getStatementOperationUseCase.execute({
                user_id,
                statement_id
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    })

});