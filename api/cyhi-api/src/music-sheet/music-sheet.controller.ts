import { Controller, Post } from '@nestjs/common';
import { MusicSheetService } from './music-sheet.service';

@Controller('music-sheet')
export class MusicSheetController {
    constructor(private musicSheetService: MusicSheetService){}
    @Post('/setup')
    generate():string{
        try {
            this.musicSheetService.setupDatabase();
            return ('New values added to dabases');
        } catch(e){
            return ('Failed to set up database');
        }
    }
}
