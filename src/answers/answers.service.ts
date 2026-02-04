import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class AnswersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, createAnswerDto: CreateAnswerDto) {
        const { questionId, content, emotionScore, isPublic } = createAnswerDto;

        // Create new answer
        return this.prisma.answer.create({
            data: {
                content,
                questionId,
                userId,
                emotionScore,
                isPublic: isPublic ?? false,
            },
        });
    }

    async findMonthly(userId: string, year: number, month: number) {
        // Calculate start and end date for the month
        // Note: month is 1-based or 0-based? Let's assume 1-based from client.
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of month

        return this.prisma.answer.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                question: true, // Include question details
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async delete(userId: string, answerId: string) {
        // Ensure user owns the answer
        const answer = await this.prisma.answer.findUnique({
            where: { id: answerId },
        });

        if (!answer || answer.userId !== userId) {
            throw new Error('Answer not found or unauthorized');
        }

        return this.prisma.answer.delete({
            where: { id: answerId },
        });
    }
}
