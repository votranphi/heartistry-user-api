import { ApiProperty } from "@nestjs/swagger";

export class PasswordRecoveryDto {
    @ApiProperty({
        description: 'Username of the user',
        example: 'nguyenvana'
    })
    username: string;

    @ApiProperty({
        description: 'Email of the user',
        example: 'nguyenvana@gmail.com'
    })
    email: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: '09090090009'
    })
    phoneNumber: string;
}