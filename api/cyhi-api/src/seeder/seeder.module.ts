import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicSheet } from 'src/music-sheet/music-sheet.entity';
import { SeederService } from 'src/seeder/seeder.service';
import { MusicSheetModule } from 'src/music-sheet/music-sheet.module';
import { Exercise } from 'src/exercise/exercise.entity';
import { ExerciseModule } from 'src/exercise/exercise.module';

@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'bonjour',
        database: 'cyhi',
        entities: [MusicSheet, Exercise],
        synchronize: true,
      }),
      MusicSheetModule,
      ExerciseModule],
    providers: [SeederService],
  })
  export class SeederModule {}

