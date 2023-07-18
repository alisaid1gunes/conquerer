import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {MinLength} from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    username: string;

    @Column()
    @MinLength(8)
    password: string;

    @Column({ type: 'text', nullable: true })
    refreshToken: string | null;


}
