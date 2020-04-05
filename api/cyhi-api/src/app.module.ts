import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExerciseModule } from './exercise/exercise.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise/exercise.entity';
import { MusicSheet } from './music-sheet/music-sheet.entity';
import { MusicSheetModule } from './music-sheet/music-sheet.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'bonjour',
      database: 'cyhi',
      entities: [Exercise, MusicSheet],
      synchronize: true,
    }),
    ExerciseModule,
    MusicSheetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
