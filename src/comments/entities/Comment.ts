import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/User';
import { Blog } from '../../blogs/entities/Blog';
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  content: string;

  @Index()
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Index()
  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;

  @Index()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateAt?: Date;
}
