import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/getuser.decorator';
import { User } from './schemas/user.schema';
import { BaseUserDto } from './dto/user-response.dto';

@ApiTags('Users')
@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Returns current user', type: BaseUserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@CurrentUser() user: User) {
    // Note: In a real implementation, this would get user from JWT token
    // For now, we'll return a placeholder response
    return {user: await this.getUserVendors(user._id.toString())}

  }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('CreateUserDto:', createUserDto);
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      user,
    };
  }

  @Patch(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(userId, updateUserDto);
    return {
      success: true,
      user,
    };
  }

  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getById(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      success: true,
      user,
    };
  }

  @Get('phone/:phone')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by phone' })
  @ApiResponse({ status: 200, description: 'Returns user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getByPhone(@Param('phone') phone: string) {
    const user = await this.usersService.findByPhone(phone);
    return {
      success: true,
      user,
    };
  }

  @Post(':userId/page-view')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Increment page view count' })
  @ApiResponse({ status: 200, description: 'Page view incremented' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async incrementPageView(@Param('userId') userId: string) {
    const result = await this.usersService.incrementPageView(userId);
    return result;
  }

  @Get(':userId/vendors')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user with vendors' })
  @ApiResponse({ status: 200, description: 'Returns user with vendors' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserVendors(@Param('userId') userId: string) {
    const user = await this.usersService.getUserWithVendors(userId);
    return {
      success: true,
      ...user,
    };
  }

  @Get(':userId/notifications')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user with notifications' })
  @ApiResponse({ status: 200, description: 'Returns user with notifications' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserNotifications(@Param('userId') userId: string) {
    const user = await this.usersService.getUserWithNotifications(userId);
    return {
      success: true,
      ...user,
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns paginated users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 12,
    @Query('search') search?: string,
  ) {
    const result = await this.usersService.findAll(
      Number(page),
      Number(limit),
      search,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Get(':userId/admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user details with all data (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns detailed user info' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getAdminUserDetails(@Param('userId') userId: string) {
    const user = await this.usersService.getAdminUserDetails(userId);
    return {
      success: true,
      user,
    };
  }
}