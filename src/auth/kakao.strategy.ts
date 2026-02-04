import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>('KAKAO_APP_KEY'),
            callbackURL: '/auth/kakao/callback', // Not used for REST API login but required by strategy
            clientSecret: '', // Optional
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const payload = {
            kakaoId: profile.id,
            nickname: profile.username || profile.displayName,
            email: profile._json?.kakao_account?.email,
            profileImage: profile._json?.properties?.profile_image,
        };
        done(null, payload);
    }
}
