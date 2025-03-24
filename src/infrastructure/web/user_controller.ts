import { Request, Response } from "express";
import { UserService } from "../../application/services/user_service";
export class UserController {
  constructor(private readonly userService: UserService) {}

  async createUser(req: Request, res: Response) {
    try {
      const { name } = req.body;
      if (!name || name.length === 0) {
        return res.status(400).json({ message: "O campo nome é obrigatório." });
      }
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Error creating user" });
    }
  }
}
