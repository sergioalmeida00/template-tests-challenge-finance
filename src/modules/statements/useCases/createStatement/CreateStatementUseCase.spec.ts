import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType, Statement } from "../../entities/Statement";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { CreateStatementError } from "../createStatement/CreateStatementError";



let inMemoryStatementsRepository:InMemoryStatementsRepository;
let inMemoryUsersRepository:InMemoryUsersRepository;
let createStatementUseCase:CreateStatementUseCase;
let createUserUseCase:CreateUserUseCase;

describe("Create Statement", ()=>{
    beforeEach(()=>{
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to make deposit",async ()=>{
        const user:ICreateUserDTO ={
            email:'sergioalmeidaa00@gmail.com',
            name:'Sérgio Almeida',
            password:'1234'
        }

        const userCreated = await createUserUseCase.execute(user);
        expect(userCreated).toHaveProperty("id");
        const user_id = userCreated.id as string;

        const statementDeposit:ICreateStatementDTO ={
            amount:300,
            description:'test deposit',
            type:'deposit' as OperationType,
            user_id
        }

        const resultDeposit = await createStatementUseCase.execute(statementDeposit);
       
        expect(resultDeposit).toHaveProperty("id");
        expect(resultDeposit.user_id).toEqual(user_id);
        expect(resultDeposit.amount).toEqual(statementDeposit.amount);
        expect(resultDeposit.type).toEqual(statementDeposit.type);
    });

    it("should be able to make withdraw",async ()=>{
        const user:ICreateUserDTO ={
            email:'sergioalmeidaa00@gmail.com',
            name:'Sérgio Almeida',
            password:'1234'
        } 
        const userCreated = await createUserUseCase.execute(user);
        expect(userCreated).toHaveProperty("id");
        const user_id = userCreated.id as string;
        const deposit:ICreateStatementDTO ={
            amount:300,
            description:'test deposit',
            type:'deposit' as OperationType,
            user_id
        }

        await createStatementUseCase.execute(deposit);

        const withdraw:ICreateStatementDTO ={
            amount:100,
            description:'test withdraw',
            type:'withdraw' as OperationType,
            user_id
        }

        const resultWithdraw = await createStatementUseCase.execute(withdraw);
     
        expect(resultWithdraw).toHaveProperty("id");
        expect(resultWithdraw.user_id).toEqual(user_id);
        expect(resultWithdraw.description).toEqual(withdraw.description);
        expect(resultWithdraw.amount).toEqual(withdraw.amount);
        expect(resultWithdraw).toBeInstanceOf(Statement);

    });

    it("should not be able to deposit/withdraw with non-existing user",async () =>{
        expect(async ()=>{
            const user_id = 'qeqw123412-qeqw123412-qeqw123412';
            const deposit:ICreateStatementDTO ={
                amount:300,
                description:'Test is not User',
                type:'deposit' as OperationType,
                user_id
            }

            await createStatementUseCase.execute(deposit);
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("should not be able to withdraw without money",async ()=>{
        expect(async ()=>{
            const user:ICreateUserDTO ={
                email:'sergioalmeidaa00@gmail.com',
                name:'Sérgio Almeida',
                password:'1234'
            } 

            const userCreated = await createUserUseCase.execute(user);
            expect(userCreated).toHaveProperty("id");

            const user_id = userCreated.id as string;

            const statementDeposit:ICreateStatementDTO ={
                amount:300,
                description:'test deposit',
                type:'deposit' as OperationType,
                user_id
            }

            await createStatementUseCase.execute(statementDeposit);

            const withdraw:ICreateStatementDTO ={
                amount:700,
                description:'test deposit',
                type:'withdraw' as OperationType,
                user_id
            }

            await createStatementUseCase.execute(withdraw);

        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});
