import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Comment } from './entities/comment.entity';
import { Item } from './entities/item.entity';
import { Listing } from './entities/listing.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createItemDto: CreateItemDto) {
    console.log('>>>>>>>>>> ', createItemDto);
    const listing = new Listing({
      ...createItemDto.listing,
      rating: 0,
    });

    const item = new Item({
      ...createItemDto,
      comments: [],
      listing,
    });
    await this.entityManager.save(item);
  }

  async findAll() {
    const items = await this.itemRepository.find();
    return items;
  }

  async findOne(id: number) {
    return this.itemRepository.findOne({
      where: { id },
      relations: { listing: true, comments: true },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepository.findOneBy({ id });
    if (item) {
      item.public = updateItemDto.public;
      const comments = updateItemDto.comments.map(
        (createCommentDto) => new Comment(createCommentDto),
      );
      item.comments = comments;
      await this.entityManager.save(item);

      return `This action updates a #${id} item`;
    }
  }

  async remove(id: number) {
    return this.itemRepository.delete(id);
  }
}
