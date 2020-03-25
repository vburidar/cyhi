import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Exercise])],
    controllers: [ExerciseController],
    providers: [ExerciseService],
})
export class ExerciseModule {
}

