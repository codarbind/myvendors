import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseUserDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly repo: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.repo.findByPhone(createUserDto.phone);

    if (existingUser) {
      return this.sanitizeUser(existingUser);
      //throw new BadRequestException('User with this phone already exists');
    }

    const user = await this.repo.create(createUserDto);
    return this.sanitizeUser(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user? this.sanitizeUser(user): null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = await this.repo.findByPhone(phone);

    return user? this.sanitizeUser(user): null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check name update cooldown (3 months)
    if (updateUserDto.name && user.nameUpdatedAt) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      if (user.nameUpdatedAt > threeMonthsAgo) {
        throw new BadRequestException('Name can only be updated once every 3 months');
      }
    }

    // Update user
    const updatedUser = await this.repo.update(id, {
      ...updateUserDto,
      nameUpdatedAt: updateUserDto.name ? new Date() : user.nameUpdatedAt,
    });

    return this.sanitizeUser(updatedUser);
  }

  async incrementPageView(userId: string): Promise<{ success: boolean }> {
    await this.repo.incrementPageView(userId);
    return { success: true };
  }

  async getUserWithVendors(userId: string): Promise<BaseUserDto> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get vendors added by this user
    const vendors = await this.repo.findVendorsByUserId(userId);

    //get notifications for user

    const notifications = await this.repo.findNotificationsByUserId(userId)
    
    return {
      ...this.sanitizeUser(user),
      vendors,
      notifications
    };
  }

  async getUserWithNotifications(userId: string): Promise<any> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get notifications for this user
    const notifications = await this.repo.findNotificationsByUserId(userId);
    
    return {
      ...this.sanitizeUser(user),
      notifications,
    };
  }

  async searchUsers(search: string, page: number = 1, limit: number = 12): Promise<any> {
    const { users, total } = await this.repo.search(search, page, limit);
    
    return {
      users: users.map(user => this.sanitizeUser(user)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  sanitizeUser(user: any): any {
    if (!user) return null;
    
    const sanitized = user.toObject ? user.toObject() : user;
    
    // Remove sensitive fields
    delete sanitized.__v;
    delete sanitized.updatedAt;
    
    return sanitized;
  }

  // Admin methods
  async findAll(page: number = 1, limit: number = 12, search?: string): Promise<any> {
    const { users, total } = await this.repo.findAllPaginated(page, limit, search);
    
    return {
      users: users.map(user => this.sanitizeUser(user)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAdminUserDetails(userId: string): Promise<any> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const vendors = await this.repo.findVendorsByUserId(userId);
    const notifications = await this.repo.findNotificationsByUserId(userId);
    
    return {
      ...this.sanitizeUser(user),
      vendors,
      notifications,
    };
  }
}