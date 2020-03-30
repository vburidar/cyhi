import { Controller, Post } from '@nestjs/common';
import { MusicSheetService } from './music-sheet.service';

@Controller('music-sheet')
export class MusicSheetController {
    constructor(private musicSheetService: MusicSheetService){}
    @Post('/setup')
    generate():string{
        return this.musicSheetService.setupDatabase();
    }
}
