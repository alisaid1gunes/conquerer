import { Repository} from 'typeorm';
import {Service} from "typedi";
import {Category} from "../entities/Category";

@Service()
export class CategoryRepository extends Repository<Category> {}
