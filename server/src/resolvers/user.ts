import { MyContenxt } from 'src/types';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2';
import { EntityManager } from '@mikro-orm/postgresql';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req, em }: MyContenxt
  ) {
    // you are not logged in
    if (!req.session.userId) {
      return null
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContenxt
  ): Promise<UserResponse> {
    if (options.username.length < 2) {
      return {
        errors: [{
          field: 'username',
          message: 'username must have 2 characters or more'
        }]
      }
    }

    if (options.password.length < 3) {
      return {
        errors: [{
          field: 'password',
          message: 'your password must have 3 characters or more'
        }]
      }
    }

    const hashedPassword = await argon2.hash(options.password)
    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning('*');
      user = result[0];

      console.log(user);
    } catch (err) {
      if (err.code === '23505') {
        return {
          errors: [{
            field: 'username',
            message: 'username already taken',
          }]
        }
      }
    }

    // keep user legged in
    // after them resgister
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContenxt
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'that username doesn\'t exists',
          },
        ]
      }
    }
    const valid = await argon2.verify(user.password, options.password)
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password does\'t match'
          }
        ]
      }
    }

    req.session.userId = user.id;

    return { user };
  }
}