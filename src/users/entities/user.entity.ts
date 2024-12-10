import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Fullname of the user',
        example: 'Nguyen Van A'
    })
    @Column({ type: 'varchar', length: 30 })
    fullname: string;

    @ApiProperty({
        description: 'Username of the user',
        example: 'nguyenvana'
    })
    @Column({ type: 'varchar', length: 15 })
    username: string;

    @ApiProperty({
        description: 'Email of the user',
        example: 'nguyenvana@gmail.com'
    })
    @Column({ type: 'varchar', length: 40 })
    email: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: '0909009009'
    })
    @Column({ type: 'varchar', length: 10 })
    phoneNumber: string;

    @ApiProperty({
        description: 'Date of birth of the user',
        example: '2000-09-17'
    })
    @Column({ type: 'date' })
    dob: Date;

    @Exclude()
    @Column({ type: 'varchar' })
    password: string;

    @ApiProperty({
        description: 'Gender of the user',
        example: 'unspecified'
    })
    @Column({ type: 'enum', enum: ['male', 'female', 'unspecified'] })
    gender: string;

    @ApiProperty({
        description: 'Role of the user',
        example: 'user'
    })
    @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
    role: string;

    @ApiProperty({
        description: 'Create day of the account',
        example: new Date()
    })
    @CreateDateColumn()
    createAt: Date;

    @ApiProperty({
        description: 'The last update time of the account',
        example: new Date()
    })
    @UpdateDateColumn()
    updateAt: Date;
}
