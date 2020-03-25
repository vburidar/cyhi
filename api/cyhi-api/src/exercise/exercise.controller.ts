import { Controller, Get, Param, Post } from '@nestjs/common';
import {ExerciseService} from './exercise.service';

@Controller('exercise')
export class ExerciseController {
    constructor(private exerciseService: ExerciseService){}

    @Get(':id/result')
    findOne(@Param() params): string {
        return 'this action returns result for the test' + params.id;
    }

    @Get('/')
    create(): string {
        return this.exerciseService.getRandomMusicSheet();
    }

    @Post('/setup')
    generate():string{
        return this.exerciseService.setupDatabase();
    }
    
}
