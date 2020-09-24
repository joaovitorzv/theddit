import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export type MyContenxt = {
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis;
}