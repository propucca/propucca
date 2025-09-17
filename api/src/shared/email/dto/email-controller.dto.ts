import { IsNotEmpty } from "class-validator";

export class IEmailDto{
    @IsNotEmpty()
    to:string;

    @IsNotEmpty()
    subject:string;

    @IsNotEmpty()
    message:string;

    html?:string;
}