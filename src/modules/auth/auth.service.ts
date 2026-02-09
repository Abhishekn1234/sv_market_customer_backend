import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'
import { generateTokens, UserDTO, UserGroupDocument, VerificationDTO } from '@svmarket/shared';
import { CreateUserInput } from '../user/dto/create-user.input';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async login(email: string, password: string): Promise<VerificationDTO> {
        const user = await this.validateUser(email, password)
        if (!user) {
            throw new BadRequestException("Invalid credentials")
        }
        const token = generateTokens(this.jwtService,user)
        return {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            user: new UserDTO(user)
        }
    }

    async registerUser(input: CreateUserInput): Promise<VerificationDTO> {
        const user = await this.userService.createUser(input);
        const {accessToken, refreshToken} = generateTokens(this.jwtService,user.user);
        return {
            accessToken,
            refreshToken,
            user: user.populatedUser
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email)
        if (!user) {
            throw new BadRequestException("Invalid credentials")
        }
        const userRole = user?.role as unknown as UserGroupDocument
        const role = await this.userService.findUserGroupByName("Customer")
        if (role?._id.toString() !== userRole._id.toString()) {
            throw new BadRequestException("Invalid credentials")
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) {
            throw new BadRequestException("Invalid credentials")
        }
        return user
    }

    async refreshToken(refreshToken: string) {
        const decodedToken = this.jwtService.decode(refreshToken)
        const user = await this.userService.findById(decodedToken.id)
        if (!user) {
            throw new BadRequestException("Invalid credentials")
        }
        const token = generateTokens(this.jwtService,user)
        return {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        }
    }

    async sendOTPVerificationEmail(email: string) {
        const user = await this.userService.findUserByEmail(email)
        if (!user) {
            throw new BadRequestException("User not found")
        }

        return {
            hash: email
        }
    }

     async verifyEmailOTP(hash: string, otp: string) {

        if (otp === "123456") {
            const user = await this.userService.findUserByEmail(hash);
            if (!user) {
                throw new BadRequestException("User not found")
            }
            const token = generateTokens(this.jwtService,user)
            return {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken
            }
        }
        throw new BadRequestException("Invalid OTP"); 
    }

    async resetPassword(id:string,password: string) {
        const user = await this.userService.findById(id)
        if (!user) {
            throw new BadRequestException("User not found")
        }
        user.password = bcrypt.hashSync(password,12)
        await user.save()
        return true;
    }
}
