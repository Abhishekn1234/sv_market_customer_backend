import { CurrentUser, JwtAuthGuard, UserDTO } from '@svmarket/shared';
import type { JwtUser } from '@svmarket/shared';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Put,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdatePasswordInput } from './dto/update-password.input';
import { UpdateUserInput } from './dto/update-user.input';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getProfile(@CurrentUser() user: JwtUser): Promise<UserDTO> {
        const myUser = await this.userService.findById(user.id);
        if (!myUser) {
            throw new BadRequestException('User not found');
        }
        return new UserDTO(myUser);
    }

    @Patch('update-password')
    @ApiOperation({ summary: 'Update user password' })
    @ApiResponse({ status: 200, description: 'Password updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid old password' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updatePassword(
        @CurrentUser() user: JwtUser,
        @Body() body: UpdatePasswordInput,
    ): Promise<UserDTO> {
        const updatedUser = await this.userService.updatePassword(
            user.id,
            body.oldPassword,
            body.newPassword,
        );
        return new UserDTO(updatedUser);
    }

    @Put('update-profile')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update user profile with optional file uploads' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fullName: { type: 'string', example: 'John Doe' },
                address: { type: 'string', example: '123 Main Street' },
                profileImage: { type: 'string', format: 'binary' },
                idProof: { type: 'string', format: 'binary' },
                addressProof: { type: 'string', format: 'binary' },
                photoProof: { type: 'string', format: 'binary' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'profileImage', maxCount: 1 },
                { name: 'idProof', maxCount: 1 },
                { name: 'addressProof', maxCount: 1 },
                { name: 'photoProof', maxCount: 1 },
            ],
            {
                limits: { fileSize: 5 * 1024 * 1024 },
            },
        ),
    )
    async updateProfile(
        @CurrentUser() user: JwtUser,
        @Body() body: UpdateUserInput,
        @UploadedFiles()
        files: {
            profileImage?: Express.Multer.File[];
            idProof?: Express.Multer.File[];
            addressProof?: Express.Multer.File[];
            photoProof?: Express.Multer.File[];
        },
    ) {
        const updatedUser = await this.userService.updateProfile(user.id, body, files);
        return new UserDTO(updatedUser);
    }
}
