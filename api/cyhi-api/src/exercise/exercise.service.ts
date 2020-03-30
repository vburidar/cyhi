
import * as util from 'util';
import { parseString } from 'xml2js';
import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from 'src/exercise/exercise.entity';
import { MusicSheetService } from 'src/music-sheet/music-sheet.service';


@Injectable()
export class ExerciseService {
    
    constructor(
        @InjectRepository(Exercise)
        private exerciceRepository: Repository<Exercise>,
        private readonly musicSheetService: MusicSheetService,
    ) {}

    getExerciseObj(json, start, nbMeasure){
        let exercise:Array<Array<Array<Array<string>>>> = [];
        let param:any = {
            nbMeasure,
            clef: [],
        };
        console.log('NEW EXERCISE');
        console.log(json.Part[0]);
        json.Part[0].Staff.map((staff, idStaff) => {
            if (staff.defaultEvent){
                console.log('CLEF =', staff.defaultEvent)
                param.clef[idStaff] =  staff.defaultEvent[0];
            } else {
                param.clef[idStaff] = 'G';
            }
        });
        if (json.Style[0].keySigNaturals){
            param.keySig = [{accidental: json.Style[0].keySigNaturals}];
        }
        json.Staff.map((staff, idStaff) => {
            exercise[idStaff] = [];
            staff.Measure.map((measure, idMeasure) => {
                if (idMeasure >= start && idMeasure < start + nbMeasure) {
                    exercise[idStaff][idMeasure - start] = [];
                }
                measure.voice.map((voice, idVoice) => {
                    if (idMeasure < start){
                        voice.Event.map((event) =>{
                            if (event.concertEventType) {
                                param.clef[idStaff] = event.concertEventType;
                            }
                        });
                    }
                    if (voice.KeySig){
                        param.keySig = voice.KeySig[0].accidental;
                    }
                    if (voice.TimeSig) {
                        param.timeSig = { sigN: voice.TimeSig[0].sigN, sigD: voice.TimeSig[0].sigD};
                    }
                    if (idMeasure >= start && idMeasure < start + nbMeasure) {
                        exercise[idStaff][idMeasure - start][idVoice] = voice.Event;
                    }
                });
            });
        })
        console.log(param);
        return ({exercise, param});
    }
    
    async createRandom(nbMeasure) {
        let xml = await this.musicSheetService.getRandom()
        xml = xml.replace(/Chord|Rest|Clef/g, 'Event');
        let json: any = {};
        parseString(xml, function getResult(err, result) {
            json = result;
        })
        let length = json.museScore.Score[0].Staff[0].Measure.length;
        let start = Math.floor(Math.random() * (length - nbMeasure + 1));
        return (this.getExerciseObj(json.museScore.Score[0], start, nbMeasure));
    }

    async create(id:number, start:number, nbMeasure:number){
        let xml = await this.musicSheetService.get(id)
        xml = xml.replace(/Chord|Rest|Clef/g, 'Event');
        let json: any = {};
        parseString(xml, function getResult(err, result) {
            json = result;
        })
        return (this.getExerciseObj(json.museScore.Score[0], start, nbMeasure));
    }

    createExercise(): string{
        return ('this is an exercise');
    }

    

}
