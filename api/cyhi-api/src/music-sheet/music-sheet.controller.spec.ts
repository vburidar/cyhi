import { Test, TestingModule } from '@nestjs/testing';
import { MusicSheetController } from './music-sheet.controller';

describe('MusicSheet Controller', () => {
  let controller: MusicSheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MusicSheetController],
    }).compile();

    controller = module.get<MusicSheetController>(MusicSheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
