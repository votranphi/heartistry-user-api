import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 30 })
    fullname: string;

    @Column({ type: 'varchar', length: 15 })
    username: string;

    @Column({ type: 'varchar', length: 40 })
    email: string;

    @Column({ type: 'varchar', length: 10 })
    phoneNumber: string;

    @Column({ type: 'date' })
    dob: Date;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'enum', enum: ['male', 'female', 'unspecified'] })
    gender: string;

    @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
    role: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}
