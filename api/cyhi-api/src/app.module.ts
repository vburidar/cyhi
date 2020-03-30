import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExerciseModule } from './exercise/exercise.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise/exercise.entity';
import { MusicSheet } from './music-sheet/music-sheet.entity';
import { MusicSheetModule } from './music-sheet/music-sheet.module';
import { Answer } from './answer/answer.entity';
import { AnswerModule } from './answer/answer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'bonjour',
      database: 'cyhi',
      entities: [Exercise, MusicSheet, Answer],
      synchronize: true,
    }),
    ExerciseModule,
    MusicSheetModule,
    AnswerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
