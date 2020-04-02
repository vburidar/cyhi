import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './answer.entity';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer)
        private answerRepository: Repository<Answer>,
    ) {}

    async create(pitch){
        return await this.answerRepository.save({pitch});
    }

    async getAnswer(id){
        return await this.answerRepository.findOne(id);
    }
}
