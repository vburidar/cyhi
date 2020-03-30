import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exercise } from 'src/exercise/exercise.entity';

@Entity('answer')
export class Answer{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type=>Exercise, exercise => exercise.answer)
    exercise: Exercise;

    @Column()
    path: string;

}