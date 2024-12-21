import { ApiProperty } from "@nestjs/swagger";

export class AvatarDto {
    @ApiProperty({
        description: "Avatar's url of the user",
        example: 'https://example.com/ex.png'
    })
    avatarUrl: string;
}