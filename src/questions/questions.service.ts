import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
    constructor(private readonly prisma: PrismaService) { }

    async getTodayQuestion() {
        // Get today's question based on current date
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Find question for today
        return this.prisma.question.findFirst({
            where: {
                date: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
        });
    }

    async findMonthly(year: number, month: number) {
        // Calculate start and end date for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of month
        // Adjust for full day coverage if needed, but 'date' is usually midnight

        // Find questions within the date range
        return this.prisma.question.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                date: 'asc',
            },
        });
    }
}
