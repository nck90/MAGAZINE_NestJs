import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportService {
    constructor(private readonly prisma: PrismaService) { }

    async createReport(reporterId: string, answerId: string, reason: string) {
        // 1. Create Report
        const report = await this.prisma.report.create({
            data: {
                reporterId,
                answerId,
                reason,
            },
        });

        // 2. Check total reports for this answer
        const reportCount = await this.prisma.report.count({
            where: { answerId },
        });

        // 3. Auto-hide if threshold exceeded (e.g., 5)
        if (reportCount >= 5) {
            await this.prisma.answer.update({
                where: { id: answerId },
                data: { isPublic: false },
            });
        }

        return report;
    }
}
