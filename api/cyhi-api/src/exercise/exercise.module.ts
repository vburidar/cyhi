import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { MusicSheetService } from 'src/music-sheet/music-sheet.service';
import { MusicSheet } from 'src/music-sheet/music-sheet.entity';
import { Answer } from 'src/answer/answer.entity';
import { AnswerService } from 'src/answer/answer.service';

@Module({
    imports: [TypeOrmModule.forFeature([Exercise, MusicSheet, Answer])],
    controllers: [ExerciseController],
    providers: [ExerciseService, MusicSheetService, AnswerService],
})
export class ExerciseModule {
}

