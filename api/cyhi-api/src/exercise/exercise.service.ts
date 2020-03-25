import * as path from 'path';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';

@Injectable()
export class ExerciseService {
    constructor(
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
      ) {}

    getRandomMusicSheet():string{
        let musicSheetData:string;
        musicSheetData = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'music-sheet', 'invention_1_bach.mscx'), "utf8");
        return (musicSheetData);
    }

    createMidiFile(): string{
        return ('this is a midi file');
    }

    createExercise(): string{
        return ('this is an exercise');
    }

    setupDatabase(): string{
        let exercise = new Exercise;
        exercise.path = 'bonjour';
        this.exerciseRepository.save(exercise);
        return ('new value added to database');
    }

}
