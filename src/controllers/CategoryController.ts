import { Request, Response } from 'express'
import Prisma from '../database'
import { createSchema } from '../validations/Category/CreateSchema'

class CategoryController {
  async index (req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user['id'];

      const categories = await Prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      });

      return res.json(categories);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create (req: Request, res: Response): Promise<Response> {
    try {
      const { error } = createSchema.validate(req.body, { abortEarly: false })

      if (error) {
        return res.status(400).json({ error: error.details.map((error) => error.message) });
      }
  
      const user = await Prisma.user.findUniqueOrThrow({
        where: {
          id: req.user['id'],
        },
      });
  
      await Prisma.category.create({
        data: {
          ...req.body,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return res.status(201).send();
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const categoryId = parseInt(req.params.id);

      const category = await Prisma.category.findFirstOrThrow({
        where: {
          id: categoryId,
          userId: req.user.id,
        },
      });

      return res.status(200).json(category);
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}

export default new CategoryController()
