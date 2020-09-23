import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { MyContenxt } from '../types';
import { EntityManager } from '@mikro-orm/postgresql';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import argon2 from 'argon2';
import { v4 } from 'uuid';

import { User } from '../entities/User';

import { UsernamePasswordInput } from './types/UsernamePasswordInput';
import { validadeRegister } from '../utils/validateRegister';
import { sendMail } from '../utils/sendEmail';

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
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { em, redis }: MyContenxt
  ) {
    const userExists = await em.findOne(User, { email });
    if (!userExists) {
      // email is not in db
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      userExists.id,
      'ex',
      1000 * 60 * 60 * 24 * 3
    ); /// 3 days expiration token

    await sendMail(
      email,
      `<a href="http://localhost:3000/reset-password/${token}">reset password</a>`
    );

    return true;
  }

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
    const emailExists = !!await em.findOne(User, { email: options.email });
    const errors = validadeRegister(options, emailExists);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password)
    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          email: options.email,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning('*');
      user = result[0];

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
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { em, req }: MyContenxt
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User, usernameOrEmail.includes('@')
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail }
    );

    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: 'that username doesn\'t exists',
          },
        ]
      }
    }
    const valid = await argon2.verify(user.password, password)
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

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContenxt
  ) {
    return new Promise(resolve =>
      req.session.destroy(err => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          console.log(err);
          resolve(false)
          return
        }

        resolve(true);
      })
    );
  }

}