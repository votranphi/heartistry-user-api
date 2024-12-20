import { IsNotEmpty, IsString, Matches } from "class-validator";

const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export class PasswordDto {
    @IsString()
    @IsNotEmpty()
    @Matches(passwordRegEx, {
        message: 'Password must contain at least eight characters, one letter, one number and one special character',
    })
    password: string

    @IsString()
    @IsNotEmpty()
    @Matches(passwordRegEx, {
        message: 'Password must contain at least eight characters, one letter, one number and one special character',
    })
    newPassword: string
}