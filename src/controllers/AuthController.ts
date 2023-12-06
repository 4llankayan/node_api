import { Response, Request } from 'express'
import bcrypt from 'bcrypt'
import Prisma from '../database'
import { generateToken } from '../utils/jwt'
import { registerSchema } from '../validations/Auth/RegisterSchema'

class AuthController {
  public async register (req: Request, res: Response): Promise<Response> {
    try {
      const { error } = registerSchema.validate(req.body, { abortEarly: false })

      if (error) {
        return res.status(400).json({ error: error.details.map((error) => error.message) });
      }

      const { password, ...body } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await Prisma.user.create({
        data: {
          ...body,
          password: hashedPassword,
        },
      });

      return res.status(201).send();
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    
    const user = await Prisma.user.findFirst({
      where: { email }
    })

    if (!user) return res.status(400).send();

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Invalid password' })
    }

    return res.json({
      access_token: generateToken(user)
    })
  }
}

export default new AuthController()
