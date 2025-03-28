import { v4 as uuidv4 } from "uuid";
import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { CreateUserDto } from "../dtos/create_user_dto";
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const newUser = new User(uuidv4(), user.name);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
