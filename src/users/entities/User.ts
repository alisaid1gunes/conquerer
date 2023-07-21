import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index} from 'typeorm';
import {MinLength} from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:25, nullable:false})
    fullName: string;

    @Column({length:25, nullable:false})
    username: string;

    @Column({length:25, nullable:false})
    email: string;

    @Column({ nullable:false})
    password: string;

    @Index()
    @Column({ type: 'text', nullable: true })
    refreshToken: string | null;
    

    @Column({type: 'timestamp', nullable: true})
    birthDate?: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updateAt: Date;

}
