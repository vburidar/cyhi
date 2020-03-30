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
    async createRandom() {
        return await this.exerciseService.createRandom(2);
    }

    @Get('/:id/:start/:nbMeasure')
    async createTest(@Param() params) {
        return await this.exerciseService.create(parseInt(params.id), parseInt(params.start), parseInt(params.nbMeasure));
    }
    
}
