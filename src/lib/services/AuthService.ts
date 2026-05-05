import { UserRepository } from "@/lib/db/repositories/UserRepository";
import { errors } from "@/lib/errors/AppError";
import { hashPassword, verifyPassword } from "@/lib/utils/hash";
import { slugify } from "@/lib/utils/slug";

export class AuthService {
  constructor(private readonly users = new UserRepository()) {}

  async register(input: { email: string; username: string; password: string }) {
    const email = input.email.toLowerCase().trim();
    const username = slugify(input.username);
    if (await this.users.findByEmail(email)) throw errors.conflict("Email sudah dipakai.");
    if (await this.users.findByUsername(username)) throw errors.conflict("Username sudah dipakai.");

    return this.users.create({
      email,
      username,
      passwordHash: await hashPassword(input.password),
      displayName: username.replace(/[_-]/g, " ")
    });
  }

  async login(input: { email: string; password: string }) {
    const user = await this.users.findByEmail(input.email.toLowerCase().trim());
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw errors.unauthorized("Email atau password salah.");
    }
    return user;
  }
}
