import { Module } from '@nestjs/common';
import { MusicSheetService } from './music-sheet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicSheet } from './music-sheet.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MusicSheet])],
    providers: [MusicSheetService]
})
export class MusicSheetModule {
   
}
