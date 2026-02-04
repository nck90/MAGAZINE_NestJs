import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SignalService } from './signal.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('signal')
export class SignalController {
    constructor(private readonly signalService: SignalService) { }

    @Get('random')
    async getRandomSignal(@Req() req) {
        const userId = req.user.userId;
        return this.signalService.getRandomAnswer(userId);
    }
}
