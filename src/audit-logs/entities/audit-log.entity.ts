import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Action made',
        example: 'CREATE'
    })
    @Column({ type: 'varchar' })
    action: string;

    @ApiProperty({
        description: 'Entity has been affected',
        example: 'User'
    })
    @Column({ type: 'varchar' })
    entity: string;

    @ApiProperty({
        description: "Entity's ID",
        example: 123
    })
    @Column({ type: 'int' })
    entityId: number;

    @ApiProperty({
        description: "ID of the user who made the change",
        example: 100
    })
    @Column({ type: 'int' })
    userId: number;

    @ApiProperty({
        description: "Username of the user who made the change",
        example: "nguyenvana"
    })
    @Column({ type: 'varchar' })
    username: string;

    @ApiProperty({
        description: "Role of the user who made the change",
        example: 'admin'
    })
    @Column({ type: 'varchar' })
    role: string;

    @ApiProperty({
        description: "IP address of the user who made the change",
        example: 100
    })
    @Column({ type: 'varchar', nullable: true })
    ipAddress: string;
    
    @ApiProperty({
        description: "Details of the changes",
        example: 100
    })
    @Column({ type: 'varchar', nullable: true })
    details: string;

    @ApiProperty({
        description: "The date which user has made the change",
        example: "2024-12-21T11:10:22.402Z"
    })
    @CreateDateColumn()
    timestamp: Date;
}
