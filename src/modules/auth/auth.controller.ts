import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { CurrentUser, JwtAuthGuard, LoginInput, RefreshGuard, VerificationDTO } from '@svmarket/shared';
import { SendOtpInput } from './dto/send-otp.input';
import { VerifyOtpInput } from './dto/verify-otp.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import type { JwtUser } from '@svmarket/shared';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    async registerUser(@Body() input: CreateUserInput): Promise<VerificationDTO> {
        return this.authService.registerUser(input);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async loginUser(@Body() input: LoginInput): Promise<VerificationDTO> {
        return this.authService.login(input.email, input.password);
    }

    @Post('send-otp-email')
    @ApiOperation({ summary: 'Send OTP to email for verification' })
    @ApiResponse({ status: 201, description: 'OTP sent successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async sendOtpEmail(@Body() input: SendOtpInput) {
        return this.authService.sendOTPVerificationEmail(input.email);
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP code' })
    @ApiResponse({ status: 201, description: 'OTP verified successfully',example:{
        accessToken:"eyadsadaq2131.....",
        refreshToken:"eyadsadaq2131....."
    } })
    @ApiResponse({ status: 400, description: 'Invalid OTP' })
    async verifyOtp(@Body() input: VerifyOtpInput) {
        return this.authService.verifyEmailOTP(input.hash, input.otp);
    }

    @Post('reset-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Reset user password' })
    @ApiResponse({ status: 201, description: 'Password reset successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async resetPassword(@CurrentUser() user: JwtUser,@Body() input: ResetPasswordInput) {
        return this.authService.resetPassword(user.id,input.password);
    }

    @Post('refresh-token')
    @UseGuards(RefreshGuard)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 201, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refreshToken(@Body() input: RefreshTokenInput) {
        return this.authService.refreshToken(input.refreshToken);
    }
}
