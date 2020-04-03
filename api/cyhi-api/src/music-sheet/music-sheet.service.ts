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
    
    async setupDatabase() {
        const _this = this;
        try {
            await this.musicSheetRepository.createQueryBuilder()
            .delete()
            .from('music_sheet')
            .where('id > 0')
            .execute();
        } catch (e) {
            throw e;
        }
        let pathToScoreDir = path.join(__dirname, '..', '..', 'public', 'music-sheet');
        fs.readdir(pathToScoreDir, function (err, files) {
            //handling error
            if (err) {
                throw(err)
            } 
            //listing all files using forEach
            files.forEach(async function (file) {
                let musicSheet = new MusicSheet;
                musicSheet.path = path.join(pathToScoreDir, file);
                try {
                    await _this.musicSheetRepository.save(musicSheet);
                } catch (e){
                    throw e;
                }
            });
        });
    }

    sayhello() {
        console.log('hello');
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
