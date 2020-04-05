import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { MusicSheetService } from 'src/music-sheet/music-sheet.service';
import { MusicSheet } from 'src/music-sheet/music-sheet.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Exercise, MusicSheet])],
    controllers: [ExerciseController],
    providers: [ExerciseService, MusicSheetService],
})
export class ExerciseModule {
}

