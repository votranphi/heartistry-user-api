import { ApiProperty } from "@nestjs/swagger";

export class OtpDto {
    @ApiProperty({
        description: 'Fullname of the user',
        example: 'Nguyen Van A'
    })
    fullname: string;

    @ApiProperty({
        description: 'Username of the user',
        example: 'nguyenvana'
    })
    username: string;

    @ApiProperty({
        description: 'Email of the user',
        example: 'nguyenvana@gmmail.com'
    })
    email: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: '2004-07-27'
    })
    phoneNumber: string;

    @ApiProperty({
        description: 'Date of birth of the user',
        example: new Date()
    })
    dob: Date;

    @ApiProperty({
        description: 'Gender of the user',
        example: 'male'
    })
    gender: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'zxcv1234@123'
    })
    password: string;

    @ApiProperty({
        description: 'Otp which have just received',
        example: '123456'
    })
    otp: string;
}