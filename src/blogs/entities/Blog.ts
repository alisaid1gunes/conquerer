import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/User';
import { Category } from '../../categories/entities/Category';
import { Comment } from '../../comments/entities/Comment';
@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false, length: 100 })
  title: string;

  @Column({ nullable: false, length: 1000 })
  content: string;

  @Index()
  @ManyToOne(() => User, (user) => user.blogs)
  author: User;

  @Index()
  @ManyToOne(() => Category, (category) => category.blogs)
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments?: Comment[];

  @Index()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
