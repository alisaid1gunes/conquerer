import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index} from 'typeorm';
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

    @Index()
    @Column({ type: 'text', nullable: true })
    refreshToken: string | null;
    

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',})
    updateAt: Date;

}
