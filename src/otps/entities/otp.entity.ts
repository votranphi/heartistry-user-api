import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Otp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 15 })
    username: string;

    @Column({ type: 'varchar', length: 6 })
    otp: string;

    @Column({ type: 'int' })
    expireTime: number;
}
