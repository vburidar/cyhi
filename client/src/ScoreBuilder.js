import Vex from 'vexflow'
import { convertArmor, getKeySignature } from './PitchConverter';

export default function buildScore(data, answer, id) {
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
    parseJson(data, VF, context, answer);
    return(data);
}

function convertClef(value) {
    const dict = {
        'G' : 'treble',
        'F' : 'bass',
    }
    return (dict[value]);
}

function convertTime(value, dotted){
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

function parseVoice(voice, param, idStaff, VF, answer) {
    const notes = [];
    const tabAccidentals = {
        flat : [],
        sharp : [],
    };
    voice.forEach((event, idEvent) => {
        parseEvent(event, notes, idEvent, VF, param, idStaff, tabAccidentals, answer);
    })
    return (notes);
}

function parseEvent(event, notes, idEvent, VF, param, idStaff, tabAccidentals, answer) {
    if (event.appoggiatura || event.acciaccatura){
        return;
    }
    if (event.Note){
        const chord = [];
        let time = convertTime(event.durationType, event.dots);
        event.Note.forEach((note, idNote) => {
            chord.push(convertArmor(parseInt(note.pitch[0]), parseInt(param.keySig[0]), note, tabAccidentals));
        })
        notes.push(new VF.StaveNote({clef: convertClef(param.clef[idStaff]), keys: chord, duration: time }));
        chord.forEach((note, idNote) => {
        if (event.dots){
            notes[notes.length - 1].addDotToAll();
        }
        if (note.match(/.#\//)){
            notes[notes.length - 1].addAccidental(idNote, new VF.Accidental("#"));
        } else if (note.match(/.b\//)) {
            notes[notes.length - 1].addAccidental(idNote, new VF.Accidental("b"));
        } else if (note.match(/.n\//)) {
            notes[notes.length - 1].addAccidental(idNote, new VF.Accidental("n"));
        }
    })
    } else if (event.secret && answer !== 0){
        console.log('ANSWER=', answer);
        const chord = [];
        let time = convertTime(event.durationType, event.dots);
        chord.push(convertArmor(parseInt(answer), parseInt(param.keySig[0]), [], tabAccidentals));
        notes.push(new VF.StaveNote({clef: convertClef(param.clef[idStaff]), keys: chord, duration: time }));
        notes[notes.length - 1].setStyle({fillStyle: "red", strokeStyle: "red"});
        chord.forEach((note, idNote) => {
        if (event.dots){
            notes[notes.length - 1].addDotToAll();
        }
        if (note.match(/.#\//)){
            notes[notes.length - 1].addAccidental(idNote, new VF.Accidental("#"));
        } else if (note.match(/.b\//)) {
            notes[notes.length - 1].addAccidental(idNote, new VF.Accidental("b"));
        } else if (note.match(/.n\//)) {
            notes[notes.length - 1].addAccidental(idNote, new VF.Accidental("n"));
        }
    })
    } else if (event.durationType){
        if (event.durationType[0] === 'measure') {
            const customDuration = new Vex.Flow.Fraction(param.timeSig.sigN, param.timeSig.sigD);
            notes.push(new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: '1r', duration_override: customDuration, align_center: true }));
        } else {
            notes.push(new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: (convertTime(event.durationType) + 'r') }));
            if(event.secret){
                notes[notes.length - 1].setStyle({fillStyle: "red", strokeStyle: "red"});
            }
        }
    }
}

function parseJson(data, VF, context, answer) {
    const tabStaff =[]; //to store all the staves created with Vexflow
    const voiceToStaff = []; //to store on which staff each voice is supposed to be drawn
    let tabVoice = []; //to store all the voices (notes / rest / change of Clef)
    //this part is to parse the json file and create the VF objects
    data.exercise.forEach((Staff, idStaff) => {
        Staff.forEach((measure, idMeasure) => {
            if (idMeasure % 2 === 0) {
                tabStaff.push(new VF.Stave(400 * (idMeasure % 2) + 20, 40 + idStaff * 100 + Math.floor(idMeasure / 2) * 250, 450)
                .addClef(convertClef(data.param.clef[idStaff]))
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
                tabVoice[idMeasure].push(parseVoice(voice, data.param, idStaff, VF, answer));
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