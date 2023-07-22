import { getRepository } from 'typeorm';
import { Category } from './categories/entities/Category';
const categoryNames = ['Artificial Intelligence', 'Business', 'Money', 'Technology'];

export const createCategories = async () => {
  try {
    const categoryRepository = getRepository(Category);
    const existingCategories = await categoryRepository.find();
    if (existingCategories.length > 0) {
      console.log('Categories already exists');
      return;
    }

    const categories = categoryNames.map((name) => {
      const category = new Category();
      category.name = name;
      return category;
    });

    await categoryRepository.save(categories);

    console.log('Categories successfully created"');
  } catch (error) {
    console.error('Categories error:', error);
  }
};
