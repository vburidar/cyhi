import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerService } from './answer.service';
import { Answer } from './answer.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  providers: [AnswerService]
})
export class AnswerModule {}
