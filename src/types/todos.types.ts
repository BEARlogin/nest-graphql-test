import {
  createUnionType,
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

enum TodoType {
  TASK = 'TASK',
  NOTIFICATION = 'NOTIFICATION',
}

registerEnumType(TodoType, {
  name: 'TodoType',
});

@ObjectType()
export class TodoItemObjectType {
  @Field()
  id: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  description?: string;
  @Field(() => TodoType)
  type: TodoType;
}

@InputType()
export class CreateTodoItemInputType {
  @Field()
  title: string;
  @Field({ nullable: true })
  description?: string;
  @Field(() => TodoType)
  type: TodoType;
}

@ObjectType()
export class TaskItemObjectType extends TodoItemObjectType {
  @Field({ nullable: true })
  doneAt?: Date;
}

@ObjectType()
export class NotificationItemObjectType extends TodoItemObjectType {
  @Field({ nullable: true })
  notificationTime?: Date;
}

export const itemUnionType = createUnionType({
  name: 'ItemUnionType',
  types: () => [TaskItemObjectType, NotificationItemObjectType] as const,
  resolveType(value) {
    if (value.type === TodoType.TASK) {
      return TaskItemObjectType;
    }
    return NotificationItemObjectType;
  },
});

@InputType()
export class DeleteTodoItemInputType {
  @Field()
  id: string;
}
