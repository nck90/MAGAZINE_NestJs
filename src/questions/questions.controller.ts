import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('today')
    async getTodayQuestion() {
        return this.questionsService.getTodayQuestion();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getMonthlyQuestions(
        @Query('year') year: string,
        @Query('month') month: string
    ) {
        return this.questionsService.findMonthly(parseInt(year), parseInt(month));
    }
}
