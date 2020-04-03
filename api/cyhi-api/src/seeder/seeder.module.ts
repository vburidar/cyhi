import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicSheet } from 'src/music-sheet/music-sheet.entity';
import { SeederService } from 'src/seeder/seeder.service';
import { MusicSheetModule } from 'src/music-sheet/music-sheet.module';
import { Exercise } from 'src/exercise/exercise.entity';
import { ExerciseModule } from 'src/exercise/exercise.module';
import { Answer } from 'src/answer/answer.entity'
import { AnswerModule } from 'src/answer/answer.module';

@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'bonjour',
        database: 'cyhi',
        entities: [MusicSheet, Exercise, Answer],
        synchronize: true,
      }),
      MusicSheetModule,
      ExerciseModule, 
      AnswerModule],
    providers: [SeederService],
  })
  export class SeederModule {}

