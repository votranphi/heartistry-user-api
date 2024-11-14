import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export class SignUpDto {
    @IsString()
    @MinLength(2, { message: 'Name must have atleast 2 characters.' })
    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    @MinLength(3, { message: 'Username must have atleast 3 characters.' })
    @IsAlphanumeric(undefined, {
        message: 'Username does not allow other than alpha numeric chars.',
    })
    username: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please provide valid Email.' })
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber('VN', { message: 'Please enter a Vietnamese phone number.' })
    phoneNumber: string;

    @IsInt()
    age: number;

    @IsString()
    @IsEnum(['female', 'male', 'unspecified'])
    gender: string;

    @IsString()
    @IsNotEmpty()
    @Matches(passwordRegEx, {
        message: 'Password must contain minimum eight characters, at least one letter, one number and one special character',
    })
    password: string;
}