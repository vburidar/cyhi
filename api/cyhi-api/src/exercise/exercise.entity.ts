import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exercise')
export class Exercise{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    path: string;

}