import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Comment } from './entities/comment.entity';
import { Item } from './entities/item.entity';
import { Listing } from './entities/listing.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const listing = new Listing({
      ...createItemDto.listing,
      rating: 0,
    });

    const item = new Item({
      name: createItemDto.name,
      public: createItemDto.public,
      comments: [],
      tags: [],
      listing,
    });
    console.log('Item created:', JSON.stringify(item));

    await this.entityManager.save(item);
  }

  async findAll() {
    return this.itemsRepository.find();
  }

  async findOne(id: number) {
    return this.itemsRepository.findOne({
      where: { id },
      relations: { listing: true, comments: true, tags: true },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemsRepository.findOneBy({ id });
    if (item) {
      item.public = updateItemDto.public;
      const comments = updateItemDto.comments.map(
        (createCommentDto) => new Comment(createCommentDto),
      );
      item.comments = comments;
    }

    await this.entityManager.save(item);

    await this.entityManager.transaction(async (entityManager) => {
      const item = await this.itemsRepository.findOneBy({ id });
      if (item) {
        item.public = updateItemDto.public;
        // const comments = updateItemDto.comments.map(
        //   (createCommentDto) => new Comment(createCommentDto),
        // );
        // item.comments = comments;
      }

      await entityManager.save(item);
      const tagContent = `${Math.random()}`;
      const tag = new Tag({ content: tagContent });
      await entityManager.save(tag);
    });
  }

  async remove(id: number) {
    await this.itemsRepository.delete(id);
  }
}
