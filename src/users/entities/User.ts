import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { MinLength } from 'class-validator';
import { Blog } from '../../blogs/entities/Blog';
import { Comment } from '../../comments/entities/Comment';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25, nullable: false })
  fullName: string;

  @Column({ length: 25, nullable: false })
  username: string;

  @Column({ length: 25, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Index()
  @Column({ type: 'text', nullable: true })
  refreshToken?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  birthDate?: Date;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs?: Blog[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  @Index()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateAt?: Date;
}
