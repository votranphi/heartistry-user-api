import { ApiProperty } from "@nestjs/swagger";

export class UpdateDto {
    @ApiProperty({
        description: 'Fullname of the user',
        example: 'Nguyen Van A'
    })
    fullname: string;

    @ApiProperty({
        description: 'Email of the user',
        example: 'nguyenvana@gmail.com'
    })
    email: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: '0909009009'
    })
    phoneNumber: string;

    @ApiProperty({
        description: 'Date of birth of the user',
        example: '2000-09-17'
    })
    dob: Date;

    @ApiProperty({
        description: 'Gender of the user',
        example: 'unspecified'
    })
    gender: string;
}