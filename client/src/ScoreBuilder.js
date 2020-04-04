import Vex from 'vexflow'
import Note from './Note'
import { convertArmor, getKeySignature } from './PitchConverter';


export default class ScoreBuilder {

constructor(clef){
    this.clef = clef;
    this.answerUser = new Note(0, false, '');
    this.answer = new Note (0, false, '');
    this.armor = 0;
    this.accidental = [{sharp: [], flat: []}];
}

build(data) {
    let VF = Vex.Flow;

    let svg = document.getElementsByTagName("svg")[0];
    if (svg) {
        svg.parentNode.removeChild(svg);
    }
    var div = document.getElementById("Exercise");
    var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(900, 300);
    var context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    this.parseJson(data, VF, context);
    return(data);
}

setArmor(armor){
    this.armor = parseInt(armor);
    if (isNaN(armor)){
        this.armor = 0;
    } else {
        this.armor = parseInt(armor);
    };
}

upAnswerUser() {
    if (this.answerUser.pitch === 0){
        this.answerUser.init();
    }
    this.answerUser.up(this.armor);
}

downAnswerUser() {
    if (this.answerUser.pitch === 0){
        this.answerUser.init();
    }
    this.answerUser.down(this.armor);
}

setAnswer(answer){
    this.answer.pitch = parseInt(answer);
}

convertClef(value) {
    const dict = {
        'G' : 'treble',
        'F' : 'bass',
    }
    return (dict[value]);
}

getDottedValue(value){
    const dict = {
        'whole':'h',
        'half': 'q',
        'quarter': '8',
        'eighth': '16',
        '16th': '32',
    }
   return dict[value];
}

convertTime(value, dotted){
    const dict = {
        'whole':'w',
        'half': 'h',
        'quarter': 'q',
        'eighth': '8',
        '16th': '16',
        '32nd': '32',
    }
    if (dotted){
        return (dict[value] + 'd');
    } else {
        return dict[value];
    }
}

parseVoice(voice, param, VF) {
    const notes = [];
    const tabAccidentals = {
        flat : [],
        sharp : [],
    };
    voice.forEach((event, idEvent) => {
        if (event.concertEventType){
            this.clef = this.convertClef(event.concertEventType[0]);
        }
        this.parseEvent(event, notes, VF, param, tabAccidentals);
    })
    return (notes);
}

addChordToContext(chord, VF, notes, time, dotted) {
    notes.push(new VF.StaveNote({clef: this.clef, keys: chord, duration: time }));
    chord.forEach((note, idNote) => {
        if (dotted){
            notes[notes.length - 1].addDotToAll();
        }
        if (note.match(/.#\//)){
            notes[notes.length - 1].addAccidental(idNote, new VF.Accidental("#"));
        } else if (note.match(/.b\//)) {
        notes[notes.length - 1].addAccidental(idNote, new VF.Accidental("b"));
    } else if (note.match(/.n\//)) {
        notes[notes.length - 1].addAccidental(idNote, new VF.Accidental("n"));
    }
    });
}

parseEvent(event, notes, VF, param, tabAccidentals) {
    if (event.appoggiatura || event.acciaccatura){
        return;
    } else if (event.concertEventType) {
        notes.push(new VF.ClefNote(this.clef, "small"));
    } else if (event.Note){
        const chord = [];
        let time = this.convertTime(event.durationType, event.dots);
        event.Note.forEach((note, idNote) => {
            chord.push(convertArmor(parseInt(note.pitch[0]), parseInt(param.keySig[0]), note, tabAccidentals));
        })
        this.addChordToContext(chord, VF, notes, time, event.dots)
    } else if (event.secret && this.answerUser.pitch !== 0){
        const chord = [];
        let time = this.convertTime(event.durationType, event.dots);
        chord.push(this.answerUser.getStringValue(this.armor, tabAccidentals));
        if (this.answer.pitch !== 0 && this.answer.pitch !== this.answerUser.pitch){
            chord.push(this.answer.getStringValue(this.armor, tabAccidentals));
        }
        this.addChordToContext(chord, VF, notes, time, event.dots);
        if (this.answer.pitch && this.answer.pitch !== this.answerUser.pitch){
            notes[notes.length-1].setKeyStyle(1, {fillStyle: "green", strokeStyle: "black"});
        }
        if (this.answer.pitch === this.answerUser.pitch){
            notes[notes.length - 1].setStyle({fillStyle: "green", strokeStyle: "green"});
        } else {
            notes[notes.length - 1].setKeyStyle(0, {fillStyle: "red", strokeStyle: "red"});
        }
    } else if (event.durationType){
        if (event.durationType[0] === 'measure') {
            const customDuration = new Vex.Flow.Fraction(param.timeSig.sigN, param.timeSig.sigD);
            notes.push(new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: '1r', duration_override: customDuration, align_center: true }));
        } else {
            notes.push(new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: (this.convertTime(event.durationType) + 'r') }));
            if(event.secret){
                notes[notes.length - 1].setStyle({fillStyle: "red", strokeStyle: "red"});
                if (event.dots){
                    notes.push(new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: (this.getDottedValue(event.durationType) + 'r') }));
                }
            }
        }
    }
}

parseJson(data, VF, context) {
    const tabStaff =[]; //to store all the staves created with Vexflow
    const voiceToStaff = []; //to store on which staff each voice is supposed to be drawn
    let tabVoice = []; //to store all the voices (notes / rest / change of Clef)
    //this part is to parse the json file and create the VF objects
    data.exercise.forEach((Staff, idStaff) => {
        this.clef = this.convertClef(data.param.clef[idStaff]);
        Staff.forEach((measure, idMeasure) => {
            if (idMeasure % 2 === 0) {
                tabStaff.push(new VF.Stave(400 * (idMeasure % 2) + 20, 40 + idStaff * 100 + Math.floor(idMeasure / 2) * 250, 450)
                .addClef(this.convertClef(data.param.clef[idStaff]))
                .addTimeSignature(data.param.timeSig.sigN + '/' + data.param.timeSig.sigD)
                .addKeySignature(getKeySignature(parseInt(data.param.keySig)))
                .setContext(context).draw());
            }
            else {
                tabStaff.push(new VF.Stave(400 * (idMeasure % 2) + 70, 40 + idStaff * 100 + Math.floor(idMeasure / 2) * 250, 400)
                .setContext(context).draw());
            }
            measure.forEach((voice) => {
                if (!tabVoice[idMeasure]){
                    tabVoice[idMeasure] = [];
                }
                if (!voiceToStaff[idMeasure]){
                    voiceToStaff[idMeasure] = [];
                }
                tabVoice[idMeasure].push(this.parseVoice(voice, data.param, VF));
                voiceToStaff[idMeasure][tabVoice[idMeasure].length - 1] = tabStaff.length - 1;
            })
        });
    })
    //this part is to draw the voices on the staves and align them properly with beams
    tabVoice.forEach((measure, idMeasure) => {
        const voiceRenderer = [];
        const tabBeam = [];
        let formatter = null;    
        measure.forEach((voice, idVoice) => {
        voiceRenderer.push(new VF.Voice({num_beats: data.param.timeSig.sigN,  beat_value: data.param.timeSig.sigD}));
        voiceRenderer[idVoice].addTickables(voice);
        tabBeam.push(VF.Beam.generateBeams(voice));
        if (idVoice === 0)
            formatter = new VF.Formatter().joinVoices([voiceRenderer[0]]);
        else
            formatter = formatter.joinVoices([voiceRenderer[idVoice]]).format(voiceRenderer, 350);
        });
        measure.forEach((voice, idVoice) => {
            voiceRenderer[idVoice].draw(context, tabStaff[voiceToStaff[idMeasure][idVoice]]);
            tabBeam[idVoice].forEach(function(beam) {beam.setContext(context).draw();});
        });
    });
}
}