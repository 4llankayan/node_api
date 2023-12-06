import { Request, Response } from 'express'
import Prisma from '../database'
import { productSchema } from '../validations/Product/ProductSchema';

class ProductController {
  async index (req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user['id'];

      const products = await Prisma.product.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      });''

      return res.json(products);
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }

  async create (req: Request, res: Response): Promise<Response> {
    try {
      const { error } = productSchema.validate(req.body, { abortEarly: false })

      if (error) {
        return res.status(400).json({ error: error.details.map((error) => error.message) });
      }

      const user = await Prisma.user.findUniqueOrThrow({
        where: {
          id: req.user['id'],
        },
      });
  
      const { category_id, ...body } = req.body;

      await Prisma.product.create({
        data: {
          ...body,
          userId: user.id,
          categoryId: category_id,
        },
      });

      return res.status(201).send();
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const productId = parseInt(req.params.id);

      const product = await Prisma.product.findFirstOrThrow({
        where: {
          id: productId,
          userId: req.user.id,
        },
      });

      return res.status(200).json(product);
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { error } = productSchema.validate(req.body, { abortEarly: false })

      if (error) {
        return res.status(400).json({ error: error.details.map((error) => error.message) });
      }

      const productId = parseInt(req.params.id);

      const user = await Prisma.user.findUniqueOrThrow({
        where: {
          id: req.user['id'],
        },
      });

      await Prisma.product.findUniqueOrThrow({
        where: {
          id: productId,
          userId: user.id,
        },
      });
      
      const { category_id, ...body } = req.body;

      const updatedProduct = await Prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ...body,
          userId: user.id,
          categoryId: category_id,
        },
      });

      return res.status(200).json(updatedProduct);
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }

  async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const productId = parseInt(req.params.id);

      const user = await Prisma.user.findUniqueOrThrow({
        where: {
          id: req.user['id'],
        },
      });

      const product = await Prisma.product.findUniqueOrThrow({
        where: {
          id: productId,
          userId: user.id,
        },
      });

      await Prisma.product.delete({
        where: {
          id: product.id,
        },
      });
  
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}

export default new ProductController()

