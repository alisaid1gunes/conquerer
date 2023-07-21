import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index} from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ length: 50, unique: true , nullable:false} )
    name: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updateAt: Date;
}
