import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTranferDTO";


@injectable()
export class CreateTransferUseCase{

    constructor(
        @inject("UsersRepository")
        private userRepository:IUsersRepository,
        @inject("StatementsRepository")
        private statementRepository:IStatementsRepository
    ){}

    async execute({amount,description,sender_id,recipient_id}:ICreateTransferDTO):Promise<Statement>{
        if(sender_id === recipient_id){
            throw new CreateTransferError.CantTransferToYourSelf();            
        }

        const senderUser = await this.userRepository.findById(sender_id);

        if(!senderUser){
            throw new CreateTransferError.UserSenderNotFound();
        }

        const {balance} = await this.statementRepository.getUserBalance({user_id:sender_id});

        if(amount > balance){
            throw new CreateTransferError.InsufficientFunds();
        }

        const resultTransfer = await this.statementRepository.create({
            amount,
            description,
            type: OperationType.TRANSFER,
            user_id: sender_id,
            sender_id: recipient_id            
        });

        return resultTransfer;
    }
}