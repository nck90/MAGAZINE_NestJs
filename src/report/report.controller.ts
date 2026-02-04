import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Post()
    async createReport(@Req() req, @Body() body: { answerId: string; reason: string }) {
        return this.reportService.createReport(req.user.userId, body.answerId, body.reason);
    }
}
