import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Answer } from '@prisma/client';

@Injectable()
export class SignalService {
    constructor(private readonly prisma: PrismaService) { }

    async getRandomAnswer(currentUserId: string): Promise<Answer | null> {
        // Fetch a random answer from other users that is public
        // Efficient random sampling using raw query for PostgreSQL
        const result = await this.prisma.$queryRaw<Answer[]>`
            SELECT * FROM "Answer"
            WHERE "isPublic" = true 
            AND "userId" != ${currentUserId}
            ORDER BY RANDOM()
            LIMIT 1;
        `;

        if (result.length > 0) {
            return result[0];
        }
        return null;
    }
}
