import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exercise } from 'src/exercise/exercise.entity';

@Entity('answer')
export class Answer{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pitch: number;

}