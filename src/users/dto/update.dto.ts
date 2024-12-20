import { ApiProperty } from "@nestjs/swagger";
import {
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

const emailRegEx = /^(?:[a-zA-Z0-9.]{1,}@gmail\.com|[12][0-9]52[0-9]{4}@gm\.uit\.edu\.vn)$/;

export class UpdateDto {
    @ApiProperty({
        description: 'Fullname of the user',
        example: 'Nguyen Van A'
    })
    @IsString()
    @MinLength(2, { message: 'Name must have at least 2 characters.' })
    @IsNotEmpty()
    fullname: string;

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
    @IsPhoneNumber('VN', { message: 'Please enter a Vietnamese phone number.' })
    phoneNumber: string;

    @ApiProperty({
        description: 'Date of birth of the user',
        example: '2000-09-17'
    })
    @IsDate()
    dob: Date;

    @ApiProperty({
        description: 'Gender of the user',
        example: 'unspecified'
    })
    @IsString()
    @IsEnum(['female', 'male', 'unspecified'])
    gender: string;
}