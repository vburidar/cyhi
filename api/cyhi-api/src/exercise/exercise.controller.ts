import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import {ExerciseService} from './exercise.service';

@Controller('exercise')
export class ExerciseController {
    constructor(private exerciseService: ExerciseService){}

    @Get('/')
    async createRandom() {
        return  await this.exerciseService.createRandom(2);;
    }

    @Get('/:id/:start/:nbMeasure')
    async createTest(@Param() params) {
        return await this.exerciseService.create(parseInt(params.id), parseInt(params.start), parseInt(params.nbMeasure));
    }
    
    @Get('/answer')
    async getAnswer(@Query() query) {
        console.log('request get /answer', query);
        return await this.exerciseService.getAnswer(query.exerciseId);
    }
}
