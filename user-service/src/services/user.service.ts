import { BadRequestError, NotFoundError, ValidationError } from '../utils/errorHandler';
import { User } from '../models/user.model';
import { IAddress, IBank, IUser } from '../interfaces/user.interface';

export class UserService {
  async updateUserInfo(userId: string, userData: Partial<IUser>): Promise<IUser> {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    return updatedUser;
  }

  async updateAvatar(userId: string, avatar: string): Promise<IUser> {
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar }, { new: true });
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    return updatedUser;
  }

  async updateBankInfo(userId: string, bankInfo: IBank): Promise<IUser> {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { banks: bankInfo } },
      { new: true }
    );
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    return updatedUser;
  }

  async updateAddress(userId: string, address: IAddress): Promise<IUser> {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: address } },
      { new: true }
    );
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    return updatedUser;
  }
}

export const userService = new UserService();
