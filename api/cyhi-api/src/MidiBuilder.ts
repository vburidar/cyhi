import { Midi } from '@tonejs/midi'

function getNbTracks(data: any) : number {
    let nbTracks = 0;
    data.exercise.forEach((Staff: any) => {
        Staff[0].forEach(() => {
            nbTracks++;
        });
    });
    return (nbTracks);
}

function getFromIdTracks(idTracks: number, data:any){
    console.log('start getFromIdTracks');
    let nbTracks: number = 0;
    let ret: any = {};
    data.exercise.forEach((Staff: any, idStaff: number) => {
        Staff[0].forEach((voice: any, idVoice: number) => {
            console.log('idTracks', idTracks, 'nbTracks', nbTracks)
            if (idTracks === nbTracks){
                console.log('FOUND');
                ret = {idStaff, idVoice};
            }
            nbTracks++;
        });
    });
    return (ret);
}

function getDivision() {
    return ('01e0');
}

function getTimeSignature(data: any) {
    let sigD = data.param.timeSig.sigD.toString(16);
    let sigN = data.param.timeSig.sigD.toString(16);
    while (sigD.length < 2){
        sigD = '0' + sigD;
    }
    while (sigN.length < 2){
        sigN = '0' + sigN;
    }
    return (sigN + sigD + '1808');
}

function getSize(size: number): string{
    let ret: string = size.toString(16);
    while(ret.length < 8){
        ret = '0' + ret;
    }
    return (ret);
}

function getLengthEvent(note: any): string {
    const dict: any = {
        'whole' : 2047,
        'half' : 1023,
        'quarter' : 511,
        'eighth' : 255,
        '16th' : 127,
        '32nd' : 63,
    }
    let ret: number = dict[note.durationType[0]];
    if (note.dots) {
        ret += (ret + 1) / 2;
    }
    if (ret > 127){
        ret = ((ret & 32640) << 1) + 32768 + (ret & 127);
    }
    return (ret.toString(16));
}

function convertChord(event: any): string{
    let ret: string ='';
    event.Note.forEach((note: any, idNote: number) => {
        if (idNote === 0){
            ret = parseInt(note.pitch[0]).toString(16);
        } else {
            ret += '00' + parseInt(note.pitch[0]).toString(16);
        }
        ret += '5f';
    });
    ret += getLengthEvent(event);
    event.Note.forEach((note: any, idNote: number) => {
        ret += parseInt(note.pitch[0]).toString(16) + '00';
        if (event[idNote + 1]){
            ret += '00';
        }
    })
    return (ret + '01');
}

function getLengthRest(event: any, currentInterval: any)
{
    const dict: any = {
        'whole' : 2047,
        'half' : 1023,
        'quarter' : 511,
        'eighth' : 255,
        '16th' : 127,
        '32nd' : 63,
    }
	let ret = dict[event.durationType[0]] + currentInterval['raw'];
	currentInterval['raw'] = ret;
	if (ret > 127)
		ret = ((ret & 32640) << 1) + 32768 + (ret & 127);
	return ({length: ret.toString(16), currentInterval: currentInterval['raw']});
}

function convertRest(event: any, track: any, currentInterval: any, lengthTrack: number)
{
    const restObj = getLengthRest(event, currentInterval);
    const ret = restObj.length;
    currentInterval['raw'] = restObj.currentInterval;
	let previousInterval = currentInterval['refined'];
	currentInterval['refined'] = ret;
    lengthTrack += currentInterval['refined'].length / 2 - previousInterval.length / 2;
    return({ lengthTrack, 
        currentIntervalRefined: currentInterval['refined'], 
        currentIntervalRaw: currentInterval['raw'],
        track: track.substr(0, track.length - previousInterval.length) + ret, 
    });
}

function convertNbTracks(nbTracks : number): string{
    let ret = nbTracks.toString(16);
	while (ret.length < 4)
	{
		ret = '0' + ret;
	}
	return (ret);
}

export default function buildMidi(data: any) {
    console.log(data.exercise);
    const nbTracks = getNbTracks(data);
    let midiFile: string = '4d546864000000060001' + convertNbTracks(nbTracks);
    midiFile += getDivision();
    for (let i=0; i <nbTracks; i++){
        console.log('getFromIdTracks', getFromIdTracks(i, data));
        const idStaff: number = getFromIdTracks(i, data).idStaff;
        const idVoice: number = getFromIdTracks(i, data).idVoice;
        const currentInterval: any =[];
        let idMeasure: number = 0;
        let idEvent: number = 0;
        let lengthTrack: number = 21; //initialized with header length
        let track: string = '00ff5804' + getTimeSignature(data);
        track += '00ff5902' + '0000'; //key signature
        track += '00ff5103' + '0b71b2'; //tempo
        let firstEvent = true;
        let event = data.exercise[idStaff][0][idVoice][0];
        while (event) {
            if (event.appoggiatura || event.acciaccatura){
            }
            else if (event.durationType) {
                if (idEvent === 0 && idMeasure === 0){
                    currentInterval['raw'] = 1;
                    currentInterval['refined'] = '01';
                    track += '01';
                    lengthTrack+=2;
                }
                if (event.Note){
                    if (firstEvent === true){
                        track += '90';
                        firstEvent = false;
                    }
                    let tmpEvent: string = convertChord(event);
                    currentInterval['raw'] = 1;
                    currentInterval['refined'] = '01';
                    lengthTrack += tmpEvent.length / 2;
                    track += tmpEvent;
                } else if (event.durationType) {
                    const restObj = convertRest(event, track, currentInterval, lengthTrack);
                    currentInterval['refined'] = restObj.currentIntervalRefined;
                    currentInterval['raw'] = restObj.currentIntervalRaw;
                    lengthTrack = restObj.lengthTrack;
                    track = restObj.track
                }
            }
            idEvent += 1;
            event = data.exercise[idStaff][idMeasure][idVoice][idEvent];
            if (!event && data.exercise[idStaff][idMeasure + 1]){
                idMeasure += 1;
                idEvent = 0;
                event = data.exercise[idStaff][idMeasure][idVoice][idEvent];
            }
        }
        track+= 'ff2f00';
        lengthTrack += 3;
        midiFile += '4d54726b' + getSize(lengthTrack) + track;
    }
    let r = hexToAscii(midiFile);
    const midi = new Midi(str2ab(r));
    return (midi);
}

function str2ab(str: string): ArrayBuffer {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

function hexToAscii(str1:string) : string {
	var hex: string  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }