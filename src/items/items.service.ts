import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createItemDto: CreateItemDto) {
    const item = new Item(createItemDto);
    await this.entityManager.save(item);
    return 'This action adds a new item';
  }

  async findAll() {
    const items = await this.itemRepository.find();
    return items;
  }

  async findOne(id: number) {
    return this.itemRepository.findOneBy({ id });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepository.findOneBy({ id });
    if (item) {
      item.public = updateItemDto.public;
      await this.entityManager.save(item);
      return `This action updates a #${id} item`;
    }
  }

  async remove(id: number) {
    return this.itemRepository.delete(id);
  }
}
