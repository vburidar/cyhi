import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exercise } from 'src/exercise/exercise.entity';

@Entity('music_sheet')
export class MusicSheet{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type=>Exercise, exercise => exercise.music_sheet)
    exercise: Exercise[];

    @Column()
    path: string;

}