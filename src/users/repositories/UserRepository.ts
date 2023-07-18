import { Repository} from 'typeorm';
import { User } from '../entities/User';
import {Service} from "typedi";

@Service()
export class UserRepository extends Repository<User> {





}
