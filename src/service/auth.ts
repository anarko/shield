import { Errors, environment } from "../utils";
import jwt from "jsonwebtoken";
import { UserData } from "./dto";
import { userService } from "./user";

type TokenData = {
  userId: string;
  token: string;
};

export class AuthService {
  private secretKey!: string;

  // All tokens are revoked if the server is restarted
  private jwtList: TokenData[] = [];

  constructor() {
    if (!environment.JWT_SECRET_KEY) {
      throw Errors.invalidConfig("JWT_SECRET_KEY not configured");
    }
    this.secretKey = environment.JWT_SECRET_KEY;
  }

  public async register({ email, password }: UserData) {
    return userService.create({ email, password });
  }

  public async signIn({ email, password }: UserData): Promise<string> {
    if (!email || !password) {
      throw Errors.invalidCredentials("Invalid credentials");
    }

    const user = await userService.findByEmailAndPassword({ email, password });

    const token = jwt.sign({ userId: user.id, renew: "1h" }, this.secretKey, {
      expiresIn: "1h",
    });
    this.jwtList.push({ userId: user.id, token });
    return token;
  }

  public async verifyToken(token: string) {
    const existentToken = this.jwtList.find((t) => t.token === token);
    if (!existentToken) {
      throw Errors.invalidCredentials();
    }

    try {
      const payload = jwt.verify(token, this.secretKey);
      return payload as { userId: string };
    } catch (error) {
      this.jwtList = this.jwtList.filter((t) => t.token !== token);
      throw Errors.invalidCredentials();
    }
  }

  public async signOut(userId: string) {
    console.log("signOut", userId);
    this.jwtList = this.jwtList.filter((t) => t.userId !== userId);
  }
}

export const authService = new AuthService();
