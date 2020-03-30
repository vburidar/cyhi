import { Test, TestingModule } from '@nestjs/testing';
import { MusicSheetService } from './music-sheet.service';

describe('MusicSheetService', () => {
  let service: MusicSheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicSheetService],
    }).compile();

    service = module.get<MusicSheetService>(MusicSheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
