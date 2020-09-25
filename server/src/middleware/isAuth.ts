import { MiddlewareFn } from "type-graphql";
import { MyContenxt } from "src/types";

export const isAuth: MiddlewareFn<MyContenxt> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error('Not authenticated');
  }

  return next();
};