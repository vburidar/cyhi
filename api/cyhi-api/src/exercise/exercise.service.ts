
import * as util from 'util';
import { parseString } from 'xml2js';
import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from 'src/exercise/exercise.entity';
import { MusicSheetService } from 'src/music-sheet/music-sheet.service';
import buildMidi from 'src/MidiBuilder';
import { AnswerService } from 'src/answer/answer.service';


@Injectable()
export class ExerciseService {
    
    constructor(
        @InjectRepository(Exercise)
        private exerciceRepository: Repository<Exercise>,
        private readonly musicSheetService: MusicSheetService,
        private readonly answerService: AnswerService,
    ) {}

    async getExerciseObj(json, start, nbMeasure){
        let exercise: any = [];
        let param:any = {
            nbMeasure,
            clef: [],
        };
        let missingNotePool = [];
        json.Part[0].Staff.map((staff, idStaff) => {
            if (staff.defaultEvent){
                param.clef[idStaff] =  staff.defaultEvent[0];
            } else {
                param.clef[idStaff] = 'G';
            }
        });
        if (json.Style[0].keySigNaturals){
            param.keySig = [{accidental: json.Style[0].keySigNaturals}];
        }
        json.Staff.forEach((staff, idStaff) => {
            exercise[idStaff] = [];
            staff.Measure.forEach((measure, idMeasure) => {
                if (idMeasure >= start && idMeasure < start + nbMeasure) {
                    exercise[idStaff][idMeasure - start] = [];
                }
                measure.voice.forEach((voice, idVoice) => {
                    if (voice.KeySig){
                        param.keySig = voice.KeySig[0].accidental;
                    }
                    if (voice.TimeSig) {
                        param.timeSig = { sigN: voice.TimeSig[0].sigN, sigD: voice.TimeSig[0].sigD};
                    }
                    if (idMeasure >= start && idMeasure < start + nbMeasure) {
                        exercise[idStaff][idMeasure - start][idVoice] = voice.Event;
                        voice.Event.forEach((event, idEvent) => {
                            if (event.Note && event.Note.length === 1){
                                const exerciseIdMeasure = idMeasure - start;
                                missingNotePool.push({idStaff, idMeasure : exerciseIdMeasure, idVoice, idEvent});
                            }
                        });
                    }
                    if (idMeasure >= start){
                        return; 
                    }
                    voice.Event.map((event) =>{
                        if (event.concertEventType) {
                            param.clef[idStaff] = event.concertEventType;
                        }
                    });
                });
            });
        })
        const midi = buildMidi({exercise, param})
        let missingNoteId = Math.floor(Math.random() * (missingNotePool.length));
        let missingNoteParams = {
            idStaff: missingNotePool[missingNoteId].idStaff,
            idMeasure: missingNotePool[missingNoteId].idMeasure,
            idVoice: missingNotePool[missingNoteId].idVoice,
            idEvent: missingNotePool[missingNoteId].idEvent}
        let missingNote = exercise[missingNoteParams.idStaff][missingNoteParams.idMeasure][missingNoteParams.idVoice][missingNoteParams.idEvent].Note;
        delete exercise[missingNoteParams.idStaff][missingNoteParams.idMeasure][missingNoteParams.idVoice][missingNoteParams.idEvent].Note;
        exercise[missingNoteParams.idStaff][missingNoteParams.idMeasure][missingNoteParams.idVoice][missingNoteParams.idEvent].secret = true;
        let insert = await this.answerService.create(missingNote[0].pitch[0])
        return ({exercise, param, midi, id: insert.id});
    }
    
    async createRandom(nbMeasure: number) {
        let xml = await this.musicSheetService.getRandom()
        xml = xml.replace(/Chord|Rest|Clef/g, 'Event');
        let json: any = {};
        parseString(xml, function getResult(err, result) {
            json = result;
        })
        let length = json.museScore.Score[0].Staff[0].Measure.length;
        let start = Math.floor(Math.random() * (length - nbMeasure + 1));
        return (await this.getExerciseObj(json.museScore.Score[0], start, nbMeasure));
    }

    async create(id:number, start:number, nbMeasure:number){
        let xml: any = await this.musicSheetService.get(id)
        xml = xml.replace(/Chord|Rest|Clef/g, 'Event');
        let json: any = {};
        parseString(xml, function getResult(err, result) {
            json = result;
        })
        return (this.getExerciseObj(json.museScore.Score[0], start, nbMeasure));
    }


    async getAnswer(id) {
        return (await this.answerService.getAnswer(id));
    }
    
}
