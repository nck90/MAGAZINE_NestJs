import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) { }

    async loginWithKakao(accessToken: string) {
        // 1. Verify Token with Kakao API
        let kakaoUser;
        try {
            const { data } = await lastValueFrom(
                this.httpService.get('https://kapi.kakao.com/v2/user/me', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
            );
            kakaoUser = data;
        } catch (error) {
            throw new UnauthorizedException('Invalid Kakao Token');
        }

        const kakaoId = kakaoUser.id.toString();
        const nickname = kakaoUser.properties?.nickname || 'User';
        const profileImage = kakaoUser.properties?.profile_image || '';
        const email = kakaoUser.kakao_account?.email;

        // 2. Find or Create User
        let user = await this.prisma.user.findUnique({
            where: { kakaoId },
        });

        // Treat as new user if record doesn't exist OR nickname is still the default "User"
        // This ensures onboarding triggers for users who haven't completed setup
        const isNewUser = !user || user.nickname === 'User';

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    kakaoId,
                    nickname,
                    profileImage,
                    email,
                },
            });
        }

        // 3. Generate JWT
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const safeUser = user!;
        const payload = { sub: safeUser.id, username: safeUser.nickname };
        const jwt = this.jwtService.sign(payload);

        // Refresh Token Logic (Optional implementation)
        // await this.prisma.user.update({ where: { id: user.id }, data: { refreshToken: ... } });

        return {
            accessToken: jwt,
            user: {
                id: safeUser.id,
                nickname: safeUser.nickname,
                email: safeUser.email,
                profileImage: safeUser.profileImage,
            },
            isNewUser,
        };
    }

    async updateProfile(userId: string, nickname: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { nickname },
        });
    }

    async getUser(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }

    async withdraw(userId: string) {
        // Use transaction to delete related data then the user
        // Required because cascade delete is not set in schema
        return this.prisma.$transaction([
            this.prisma.answer.deleteMany({ where: { userId } }),
            this.prisma.monthlyStat.deleteMany({ where: { userId } }),
            this.prisma.user.delete({ where: { id: userId } }),
        ]);
    }
}
