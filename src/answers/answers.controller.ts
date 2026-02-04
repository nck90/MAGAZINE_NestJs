import { Controller, Get, Post, Body, Query, UseGuards, Req, Delete, Param } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('answers')
export class AnswersController {
    constructor(private readonly answersService: AnswersService) { }

    @Post()
    async create(@Req() req, @Body() createAnswerDto: CreateAnswerDto) {
        // req.user is populated by JwtStrategy
        const userId = req.user.id;
        return this.answersService.create(userId, createAnswerDto);
    }

    @Get()
    async findMonthly(
        @Req() req,
        @Query('year') year: string,
        @Query('month') month: string,
    ) {
        const userId = req.user.id;
        return this.answersService.findMonthly(userId, parseInt(year), parseInt(month));
    }

    @Delete(':id')
    async remove(@Req() req, @Param('id') id: string) {
        const userId = req.user.id;
        return this.answersService.delete(userId, id);
    }
}
