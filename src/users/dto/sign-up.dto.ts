import { ApiProperty } from '@nestjs/swagger';
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
const emailRegEx = /^(?:[a-zA-Z0-9.]{1,}@gmail\.com|[12][0-9]52[0-9]{4}@gm\.uit\.edu\.vn)$/;

export class SignUpDto {
    @ApiProperty({
        description: 'Fullname of the user',
        example: 'Nguyen Van A'
    })
    @IsString()
    @MinLength(2, { message: 'Name must have at least 2 characters.' })
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({
        description: 'Username of the user',
        example: 'nguyenvana'
    })
    @IsNotEmpty()
    @MinLength(3, { message: 'Username must have at least 3 characters.' })
    @IsAlphanumeric(undefined, {
        message: 'Username does not allow other than alpha numeric chars.',
    })
    username: string;

    @ApiProperty({
        description: 'Email of the user',
        example: 'nguyenvana@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please provide valid Email.' })
    @Matches(emailRegEx, {
        message: "Email's postfix must be @gmail.com or @gm.uit.edu.vn",
    })
    email: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: '0909009009'
    })
    @IsNotEmpty()
    @IsPhoneNumber('VN', { message: 'Please enter a Vietnamese phone number .' })
    phoneNumber: string;

    @ApiProperty({
        description: 'Date of birth of the user',
        example: '2004-12-29'
    })
    @IsDate()
    dob: Date;

    @ApiProperty({
        description: 'Gender of the user',
        example: 'male'
    })
    @IsString()
    @IsEnum(['female', 'male', 'unspecified'])
    gender: string;

    @ApiProperty({
        description: 'Password of the user',
        example: '09090090009'
    })
    @IsString()
    @IsNotEmpty()
    @Matches(passwordRegEx, {
        message: 'Password must contain at least eight characters, one letter, one number and one special character',
    })
    password: string;
}