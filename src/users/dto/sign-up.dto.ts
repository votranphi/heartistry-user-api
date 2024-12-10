import {
    IsAlphanumeric,
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const emailRegEx = /^(?:[a-zA-Z0-9]{1,}@gmail\.com|[12][0-9]52[0-9]{4}@gm\.uit\.edu\.vn)$/;

export class SignUpDto {
    @IsString()
    @MinLength(2, { message: 'Name must have at least 2 characters.' })
    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    @MinLength(3, { message: 'Username must have at least 3 characters.' })
    @IsAlphanumeric(undefined, {
        message: 'Username does not allow other than alpha numeric chars.',
    })
    username: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please provide valid Email.' })
    @Matches(emailRegEx, {
        message: "Email's postfix must be @gmail.com or @gm.uit.edu.vn",
    })
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber('VN', { message: 'Please enter a Vietnamese phone number.' })
    phoneNumber: string;

    @IsDate()
    dob: Date;

    @IsString()
    @IsEnum(['female', 'male', 'unspecified'])
    gender: string;

    @IsString()
    @IsNotEmpty()
    @Matches(passwordRegEx, {
        message: 'Password must contain at least eight characters, one letter, one number and one special character',
    })
    password: string;
}