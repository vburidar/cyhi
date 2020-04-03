import { SeederService } from "./seeder/seeder.service";
import { SeederModule } from "./seeder/seeder.module";
import { NestFactory } from '@nestjs/core';
import { MusicSheetService } from "./music-sheet/music-sheet.service";

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
  .then(appContext => {
    const seeder = appContext.get(MusicSheetService)    
    seeder.setupDatabase()
    //.then(appContext.close());
  })
  .catch(error => {
    throw error;
  });
  }
  bootstrap();