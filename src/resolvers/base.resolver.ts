import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';

import {
  CreateTodoItemInputType,
  DeleteTodoItemInputType,
  itemUnionType,
  TaskItemObjectType,
  TodoItemObjectType,
} from '../types/todos.types';
import { PrismaService } from '../prisma.service';
import { TodoItem } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
export class BaseResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [itemUnionType])
  getTodos(): Promise<TodoItem[]> {
    return this.prisma.todoItem.findMany({
      where: {},
    });
  }

  @Mutation(() => itemUnionType)
  async addTodoItem(
    @Args('data') data: CreateTodoItemInputType,
  ): Promise<TodoItem> {
    const { title, description, type } = data;
    const result = await this.prisma.todoItem.create({
      data: {
        title,
        description,
        type,
      },
    });
    await pubSub.publish('itemAdded', { itemAdded: result });

    return result;
  }

  @Mutation(() => itemUnionType)
  deleteTodoItem(@Args('data') data: DeleteTodoItemInputType) {
    return this.prisma.todoItem.delete({
      where: {
        id: data.id,
      },
    });
  }

  @Mutation(() => TaskItemObjectType)
  makeDoneTodoItem(@Args('id') id: string) {
    return this.prisma.todoItem.update({
      where: {
        id,
      },
      data: {
        doneAt: new Date(),
      },
    });
  }

  @Subscription(() => itemUnionType, {
    name: 'itemAdded',
  })
  onTodoItemCreated() {
    return pubSub.asyncIterator('itemAdded');
  }
}
