import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Request, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('kakao')
    async kakaoLogin(@Body('accessToken') accessToken: string) {
        console.log(`[Backend] Login Request Received. Token: ${accessToken?.substring(0, 10)}...`);
        if (!accessToken) {
            throw new UnauthorizedException('Access Token required');
        }
        try {
            const result = await this.authService.loginWithKakao(accessToken);
            console.log(`[Backend] Login Success for User: ${result.user.id}`);
            return result;
        } catch (e) {
            console.error(`[Backend] Login Failed: ${e.message}`);
            throw e;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req) {
        return this.authService.getUser(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('update') // Using Post for simplicity, or Patch
    updateProfile(@Request() req, @Body() body: { nickname: string }) {
        console.log(`Update Profile Request: User ${req.user.id}, Nickname: ${body.nickname}`);
        return this.authService.updateProfile(req.user.id, body.nickname);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('withdraw')
    async withdraw(@Request() req) {
        console.log(`Withdraw Request: User ${req.user.id}`);
        await this.authService.withdraw(req.user.id);
        return { message: 'Success' };
    }
}
