import { Module } from '@nestjs/common';
import { MusicSheetController } from './music-sheet.controller';
import { MusicSheetService } from './music-sheet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicSheet } from './music-sheet.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MusicSheet])],
    controllers: [MusicSheetController],
    providers: [MusicSheetService]
})
export class MusicSheetModule {
   
}
