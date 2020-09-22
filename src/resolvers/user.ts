import { MyContenxt } from 'src/types';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2';

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
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContenxt
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
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.detail.includes('already exists')) {
        return {
          errors: [{
            field: 'username',
            message: 'username already taken',
          }]
        }
      }
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContenxt
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

    return { user };
  }
}