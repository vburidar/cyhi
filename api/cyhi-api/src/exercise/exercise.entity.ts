import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { MusicSheet } from 'src/music-sheet/music-sheet.entity';
import { Answer } from 'src/answer/answer.entity';

@Entity('exercise')
export class Exercise{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => MusicSheet, musicSheet => musicSheet.exercise)
    musicSheet: MusicSheet;

    @Column()
    barStart: number;

    @Column()
    barEnd: number;

    @Column()
    answer: number
}