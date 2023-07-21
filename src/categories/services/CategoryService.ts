import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Category } from '../entities/Category';
import {CreateCategoryDto} from "../dto/CreateCategoryDto";

@Service()
export class CategoriesService {
    constructor( private categoryRepository: Repository<Category>) {}

    async getAllCategories(): Promise<Category[]> {
        const categories =  await this.categoryRepository.find();
        if (!categories) throw new Error('Cannot find category');
        return categories;
    }
    async getCategoryWithName(name:string): Promise<Category> {
        const category =  await this.categoryRepository.findOne({where: {name:name}});
        if (!category) throw new Error('Cannot find category');
        return category;
    }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const newCategory = await this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(newCategory);
    }

}
