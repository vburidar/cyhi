import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicSheet } from './music-sheet.entity';

@Injectable()
export class MusicSheetService {
    constructor(
        @InjectRepository(MusicSheet)
        private musicSheetRepository: Repository<MusicSheet>,
    ) {}
    
    setupDatabase(): string{
        const _this = this;
        let pathToScoreDir = path.join(__dirname, '..', '..', 'public', 'music-sheet');
        fs.readdir(pathToScoreDir, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                let musicSheet = new MusicSheet;
                musicSheet.path = path.join(pathToScoreDir, file);
                _this.musicSheetRepository.save(musicSheet);
            });
        });
        return ('new value added to database');
    }

    async getRandom(): Promise<string>{
        let nb = await this.musicSheetRepository.count();
        let randomId = Math.floor(Math.random() * nb);
        let randomRow = await this.musicSheetRepository.find({
            skip: randomId, //replace with randomId
            take: 1,
        });
        return (fs.readFileSync(randomRow[0].path, "utf8"));
    }

    async get(id) : Promise<string>{
        let row = await this.musicSheetRepository.findOne(id);
        return (fs.readFileSync(row.path, "utf8"));
    }
}
