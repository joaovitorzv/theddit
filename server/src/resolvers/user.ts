import { Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { MyContenxt } from '../types';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import argon2 from 'argon2';
import { v4 } from 'uuid';

import { User } from '../entities/User';

import { UsernamePasswordInput } from './types/UsernamePasswordInput';
import { validadeRegister } from '../utils/validateRegister';
import { sendMail } from '../utils/sendEmail';
import { getConnection } from 'typeorm';

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

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@
    Root() user: User,
    @Ctx() { req }: MyContenxt
  ) {
    // current user we can show their own email
    if (req.session.userId === user.id) {
      return user.email
    }
    // current user wants to see someone else email
    return '';
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContenxt
  ): Promise<UserResponse> {
    if (newPassword.length < 3) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'your password must have 3 characters or more'
          }
        ]
      }
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired',
          }
        ]
      }
    }

    const userID = parseInt(userId)
    const user = await User.findOne(userID);

    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exists',
          },
        ],
      };
    }

    await User.update(
      { id: userID },
      {
        password: await argon2.hash(newPassword)
      }
    );

    // login user after change password
    req.session.userId = user.id;
    await redis.del(key);

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContenxt
  ) {
    const userExists = await User.findOne({ where: { email } });
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
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContenxt) {
    // you are not logged in
    if (!req.session.userId) {
      return null
    }

    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req }: MyContenxt
  ): Promise<UserResponse> {
    const emailExists = !!await User.findOne({ email: options.email });
    const errors = validadeRegister(options, emailExists);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password)
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning('*')
        .execute();
      user = result.raw[0];
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
    @Ctx() { req }: MyContenxt
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes('@')
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
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
            message: 'password doesn\'t match'
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