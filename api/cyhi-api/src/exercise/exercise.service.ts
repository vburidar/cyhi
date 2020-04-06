
import { parseString } from 'xml2js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from 'src/exercise/exercise.entity';
import { MusicSheetService } from 'src/music-sheet/music-sheet.service';
import buildMidi from 'src/MidiBuilder';
import { MusicSheetXml } from 'src/interface/musicSheet.interface'


@Injectable()
export class ExerciseService {
    
    constructor(
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
        private readonly musicSheetService: MusicSheetService,
    ) {}

    
    public async createRandom(nbMeasure: number) {
        const musicSheet: MusicSheetXml = await this.musicSheetService.getRandom()
        console.log('ID =', musicSheet.id);
        const xml = musicSheet.xml.replace(/Chord|Rest|Clef/g, 'Event');
        let json: any = {};
        parseString(xml, function getResult(err, result) {
            json = result;
        })
        const length = json.museScore.Score[0].Staff[0].Measure.length;
        const start = Math.floor(Math.random() * (length - nbMeasure + 1));
        
        return (await this.getExerciseObj(json.museScore.Score[0], start, nbMeasure, musicSheet.id));
    }

    public async create(id:number, start:number, nbMeasure:number){
        try {
            const musicSheet: MusicSheetXml = await this.musicSheetService.getXml(id);
            const xml = musicSheet.xml.replace(/Chord|Rest|Clef/g, 'Event');
            let json: any = {};
            parseString(xml, function getResult(err, result) {
            json = result;
            });
            return (this.getExerciseObj(json.museScore.Score[0], start, nbMeasure, musicSheet.id));
        } catch (e) {
            console.log(e);
            return ({exercise: undefined, param: undefined, midi: undefined, id: undefined});
        }
    }

    public async getAnswer(id) {
        return (await this.exerciseRepository.findOne(id));
    }
    
    //TODO: rename this function
    private createMusicSheetAndNotePool(nbMeasure, json, start) {
        const musicSheet: any = [];
        const param:any = {
            nbMeasure,
            clef: [],
        };
        const notePool = [];
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
            musicSheet[idStaff] = [];
            staff.Measure.forEach((measure, idMeasure) => {
                if (idMeasure >= start && idMeasure < start + nbMeasure) {
                    musicSheet[idStaff][idMeasure - start] = [];
                }
                measure.voice.forEach((voice, idVoice) => {
                    if (voice.KeySig){
                        param.keySig = voice.KeySig[0].accidental;
                    }
                    if (voice.TimeSig) {
                        param.timeSig = { sigN: voice.TimeSig[0].sigN, sigD: voice.TimeSig[0].sigD};
                    }
                    if (idMeasure >= start && idMeasure < start + nbMeasure) {
                        musicSheet[idStaff][idMeasure - start][idVoice] = voice.Event;
                        voice.Event.forEach((event, idEvent) => {
                            if (event.Note && event.Note.length === 1){
                                const exerciseIdMeasure = idMeasure - start;
                                notePool.push({idStaff, idMeasure : exerciseIdMeasure, idVoice, idEvent});
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
        return { 'musicSheet': musicSheet, 'param': param, 'notePool': notePool};
    }

    private buildExercise(musicSheet, notePool){
        const missingNoteId = Math.floor(Math.random() * (notePool.length));
        const missingNoteParams = {
            idStaff: notePool[missingNoteId].idStaff,
            idMeasure: notePool[missingNoteId].idMeasure,
            idVoice: notePool[missingNoteId].idVoice,
            idEvent: notePool[missingNoteId].idEvent}
        const missingNote = musicSheet[missingNoteParams.idStaff][missingNoteParams.idMeasure][missingNoteParams.idVoice][missingNoteParams.idEvent].Note;
        delete musicSheet[missingNoteParams.idStaff][missingNoteParams.idMeasure][missingNoteParams.idVoice][missingNoteParams.idEvent].Note;
        musicSheet[missingNoteParams.idStaff][missingNoteParams.idMeasure][missingNoteParams.idVoice][missingNoteParams.idEvent].secret = true;
        return {'question': musicSheet, 'answer': missingNote};
    }
    
    private async getExerciseObj(json, start, nbMeasure, musicSheetId) {
        const {musicSheet, param, notePool} = this.createMusicSheetAndNotePool(nbMeasure, json, start);
        //Midi
        const midi = buildMidi({musicSheet, param})
        //Missing Note
        const { question, answer } = this.buildExercise(musicSheet, notePool);
        const insertExercise = await this.exerciseRepository.save({
            musicSheet: await this.musicSheetService.get(musicSheetId),
            barStart: start,
            barEnd: start + nbMeasure,
            answer: answer[0].pitch[0],
        })
        if (midi === null){
            return ({exercise: undefined, param: undefined, midi: undefined, id: undefined})
        }
        return ({exercise: question, param, midi, id: insertExercise.id});
    }
}
