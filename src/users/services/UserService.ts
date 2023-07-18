import { Service } from 'typedi';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';

@Service()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getUserById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    // Other user-related methods...
}
