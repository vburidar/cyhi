import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicSheet } from './music-sheet.entity';
import { MusicSheetXml } from 'src/interface/musicSheet.interface'

@Injectable()
export class MusicSheetService {
    constructor(
        @InjectRepository(MusicSheet)
        private musicSheetRepository: Repository<MusicSheet>,
    ) {}
    
    
    
    async setupDatabase() {
        const _this = this;
        //delete all rows in music_sheet
        await this.musicSheetRepository.createQueryBuilder()
        .delete()
        .from('music_sheet')
        .where('id > 0')
        .execute();
        const pathToScoreDir = path.join(__dirname, '..', '..', 'public', 'music-sheet');
        fs.readdir(pathToScoreDir, function (err, files) {
            //handling error
            if (err) {
                throw(err)
            } 
            //listing all files using forEach
            files.forEach(async function (file) {
                const musicSheet = new MusicSheet;
                musicSheet.path = path.join(pathToScoreDir, file);
                await _this.musicSheetRepository.save(musicSheet);
            });
        });
    }

    async getRandom(): Promise<MusicSheetXml>{
        const nb = await this.musicSheetRepository.count();
        const randomId = Math.floor(Math.random() * nb);
        const randomRow = await this.musicSheetRepository.find({
            skip: randomId, //replace with randomId
            take: 1,
        });
        return ({id: randomRow[0].id, xml: fs.readFileSync(randomRow[0].path, "utf8")});
    }

    async getXml(id) : Promise<MusicSheetXml>{
            const row = await this.musicSheetRepository.findOne(id);
            return ({id:row.id, xml: fs.readFileSync(row.path, "utf8")});
    }

    async get(id) : Promise<MusicSheet>{
        return (await this.musicSheetRepository.findOne(id));
    }
}
