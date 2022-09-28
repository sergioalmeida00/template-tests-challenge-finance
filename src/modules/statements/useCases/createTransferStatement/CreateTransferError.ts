import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferError {
    export class InsufficientFunds extends AppError {
      constructor() {
        super('Insufficient Founds', 404);
      }
    }
  
    export class CantTransferToYourSelf extends AppError {
      constructor() {
        super('Cant Transfer To Your Self', 400);
      }
    }

    export class UserSenderNotFound extends AppError{
        constructor(){
            super('User Sender not found' , 400);
        }
    }
  }