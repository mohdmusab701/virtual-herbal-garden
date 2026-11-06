import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { comparePassword } from '../utils/password';

export class AuthService {
  static async register(data: any) {
    const { name, email, password } = data;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id as unknown as string, user.role);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  }

  static async login(data: any) {
    const { email, password } = data;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password as string);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user._id as unknown as string, user.role);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
