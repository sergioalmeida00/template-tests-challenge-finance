import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferStastementUseCase";

export class CreateTransferController {
    async handle(request:Request, response:Response):Promise<Response>{
        const{id:sender_id}=  request.user;
        const{amount, description} = request.body;
        const {recipient_id} = request.params;

        const createTransferUseCase = container.resolve(CreateTransferUseCase);

        const resultTransfer = await createTransferUseCase.execute({
            amount,
            description,
            sender_id,
            recipient_id
        });

        return response.status(201).json(resultTransfer);
    }   
}