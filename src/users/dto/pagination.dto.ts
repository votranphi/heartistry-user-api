import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
    @ApiProperty({
        description: 'Page order to get (0-based index)',
        example: '0'
    })
    page: number;
    @ApiProperty({
        description: 'Page size (number of entities per page)',
        example: '4'
    })
    pageSize: number;
}