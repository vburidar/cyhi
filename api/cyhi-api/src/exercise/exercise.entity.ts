import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { MusicSheet } from 'src/music-sheet/music-sheet.entity';
import { Answer } from 'src/answer/answer.entity';

@Entity('exercise')
export class Exercise{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    path: string;

    @ManyToOne(type => MusicSheet, music_sheet => music_sheet.exercise)
    music_sheet: MusicSheet;

    @Column()
    barStart: number;

    @Column()
    bar_end: number;
}