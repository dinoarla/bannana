import { UserRepository } from "@/lib/db/repositories/UserRepository";
import { errors } from "@/lib/errors/AppError";
import { hashPassword, verifyPassword } from "@/lib/utils/hash";
import { slugify } from "@/lib/utils/slug";

export class AuthService {
  constructor(private readonly users = new UserRepository()) {}

  async register(input: { email: string; username: string; password: string; displayName?: string }) {
    const email = input.email.toLowerCase().trim();
    const username = slugify(input.username);
    if (await this.users.findByEmail(email)) throw errors.conflict("Email sudah dipakai.");
    if (await this.users.findByUsername(username)) throw errors.conflict("Username sudah dipakai.");

    return this.users.create({
      email,
      username,
      passwordHash: await hashPassword(input.password),
      displayName: input.displayName?.trim() || username.replace(/[_-]/g, " "),
    });
  }

  async login(input: { email: string; password: string }) {
    const user = await this.users.findByEmail(input.email.toLowerCase().trim());
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw errors.unauthorized("Email atau password salah.");
    }
    return user;
  }

  async loginOrCreateGoogle(googleUser: { email: string; name: string }) {
    const email = googleUser.email.toLowerCase().trim();
    const existing = await this.users.findByEmail(email);
    if (existing) return existing;

    let base = slugify(googleUser.name.replace(/\s+/g, "_")).slice(0, 28);
    if (base.length < 3) base = email.split("@")[0].replace(/[^a-z0-9_]/gi, "").slice(0, 28);
    let username = base;
    let n = 1;
    while (await this.users.findByUsername(username)) {
      username = `${base}${n}`;
      n++;
    }

    return this.users.create({
      email,
      username,
      passwordHash: await hashPassword(crypto.randomUUID()),
      displayName: googleUser.name,
    });
  }
}
