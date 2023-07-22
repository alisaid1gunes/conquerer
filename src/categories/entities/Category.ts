import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Blog } from '../../blogs/entities/Blog';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 50, unique: true, nullable: false })
  name: string;

  @OneToMany(() => Blog, (blog) => blog.category)
  blogs?: Blog[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateAt?: Date;
}
