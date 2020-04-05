export default class Note {

    constructor(pitch, isAccidental, accident) {
        this.pitch = pitch;
        this.isAccidental = isAccidental;
        this.accident = accident;
    }

    init(){
        this.pitch = 60;
    }
    
    up(armor) {
        this.pitch += 1;
        while (this.getAccident(armor, {flat:[], sharp:[], natural:[]}).isAccidental){
            this.pitch += 1;
        }
        this.isAccidental = false;
        this.accident = this.getAccident(armor, {flat:[], sharp:[], natural:[]}).accident;
    }

    down(armor) {
        this.pitch -= 1;
        while (this.getAccident(armor, {flat:[], sharp:[], natural:[]}).isAccidental){
            this.pitch -= 1;
        }
        this.isAccidental = false;
        this.accident = this.getAccident(armor, {flat:[], sharp:[], natural:[]}).accident;
    }

    testBackToArmor(tabAccidentals, offsetAccidental){
        for (let i=0; i < tabAccidentals.length; i++){
            if (tabAccidentals[i] === this.pitch + offsetAccidental){
                tabAccidentals.splice(tabAccidentals.indexOf(this.pitch + offsetAccidental));
                return (true);
            }
        }
        return (false)
    }

    getAccident(valueArmor, tabAccidentals){
        const sharpArmor = [-6, -1, -8, -3, -10, -5, -12];
        const flatArmor = [-10, -3, -8, -1, -6, 1, -4];
        const noArmorSharp = [-5, 0, -7, -2, -9, -4, -11];
        const noArmorFlat = [-11, -4, -9, -2, -7, 0, -5]
    
        if (valueArmor >= 0)
        {
            for (let i=0; i < sharpArmor.length ;i++)
            {
                if ( i < valueArmor && (this.pitch + sharpArmor[i]) % 12 === 0){
                    const backToArmor = this.testBackToArmor(tabAccidentals.flat, -2) || this.testBackToArmor(tabAccidentals.natural, -1);
                    return ({accident: 'sharp', isAccidental: backToArmor});
                } else if (i >= valueArmor && (this.pitch + noArmorSharp[i]) % 12 === 0){
                    const backToArmor = this.testBackToArmor(tabAccidentals.sharp, 1) || this.testBackToArmor(tabAccidentals.flat, -1);
                    return ({accident: 'natural', isAccidental: backToArmor});
                }
            }
        }
        if (valueArmor < 0)
        {
            for (let i=0; i < flatArmor.length; i++)
            {
                if (i < -valueArmor && (this.pitch + flatArmor[i]) % 12 === 0) {
                    const backToArmor = this.testBackToArmor(tabAccidentals.sharp, 2) || this.testBackToArmor(tabAccidentals.natural, 1);
                    return ({accident: 'flat', isAccidental: backToArmor});	
                } else if (i >= -valueArmor && (this.pitch + noArmorFlat[i]) % 12 === 0) {
                    const backToArmor = this.testBackToArmor(tabAccidentals.sharp, 1) || this.testBackToArmor(tabAccidentals.flat, -1)
                    return ({accident: 'natural', isAccidental: backToArmor});
                }
            }
        }
        if (tabAccidentals) {
            for (let i =0; i < tabAccidentals.flat.length; i++){
                if (this.pitch === tabAccidentals.flat[i]) {
                    return ({accident: 'flat', isAccidental: false});
                }
            }
            for (let i =0; i < tabAccidentals.sharp.length; i++){
                if (this.pitch === tabAccidentals.sharp[i]) {
                    return ({accident: 'sharp', isAccidental: false});
                }
            }
        }
        return ({accident:'unknown', isAccidental: true});
    }

    testAccidental(valueArmor){
        const sharpArmor = [-6, -1, -8, -3, -10, -5, -12];
        const flatArmor = [-10, -3, -8, -1, -6, 1, -4];
        const noArmorSharp = [-5, 0, -7, -2, -9, -4, -11];
        const noArmorFlat = [-11, -4, -9, -2, -7, 0, -5]
    
        if (valueArmor >= 0)
        {
            for (let i=0; i < sharpArmor.length ;i++)
            {
                if ( i < valueArmor && (this.pitch + sharpArmor[i]) % 12 === 0 && this.accident === 'sharp'){
                    return false;
                } else if (i >= valueArmor && (this.pitch + noArmorSharp[i]) % 12 === 0 && this.accident === 'natural'){
                    return false;
                }
            }
        }
        if (valueArmor < 0)
        {
            for (let i=0; i < flatArmor.length; i++)
            {
                if (i < -valueArmor && (this.pitch + flatArmor[i]) % 12 === 0 && this.accident === 'flat') {
                    return (false);	
                } else if (i >= -valueArmor && (this.pitch + noArmorFlat[i]) % 12 === 0 && this.accident === 'natural') {
                    return (false);
                }
            }
        }
        return (true);
    }

    setAccident(accidental, valueArmor) {
        if ( this.accident === 'sharp'){
            if (accidental === 'flat'){
                this.pitch -= 2;
                this.accident = 'flat';
            } else if (accidental === 'natural') {
                this.pitch -= 1;
                this.accident = 'natural';
            }
            
        } else if (this.accident === 'flat'){
            if (accidental === 'sharp'){
                this.pitch += 2;
                this.accident = 'sharp';
            } else if (accidental === 'natural') {
                this.pitch += 1;
                this.accident = 'natural';
            }
        } else if (this.accident === 'natural') {
            if (accidental === 'flat'){
                this.pitch -= 1;
                this.accident = 'flat';
            } else if (accidental === 'sharp') {
                this.pitch += 1;
                this.accident = 'sharp';
            }
        }
        this.isAccidental = this.testAccidental(valueArmor);
    }

    getStringValue(valueArmor, tabAccidentals){
        const sharpArmor = [-6, -1, -8, -3, -10, -5, -12];
        const flatArmor = [-10, -3, -8, -1, -6, 1, -4];
    
        if (valueArmor > 0)
        {
            for (let i=0; i < valueArmor;i++)
            {
                if ((this.pitch + sharpArmor[i]) % 12 === 0) {
                    if (this.isAccidental && this.accident === 'sharp') {
                        return (this.convertPitch(this.pitch, tabAccidentals));
                    } else if (this.accident === 'sharp') {
                        return (this.convertPitch(this.pitch - 1, tabAccidentals));
                    }
                }
            }
        }
        if (valueArmor < 0)
        {
            for (let i=0; i < -valueArmor; i++)
            {
                if ((this.pitch + flatArmor[i]) % 12 === 0) {
                    if (this.isAccidental && this.accident === 'flat') {
                        return (this.convertPitch(this.pitch, tabAccidentals));
                    }
                    else if (this.accident === 'flat') {
                        return (this.convertPitch(this.pitch + 1, tabAccidentals));
                    }
                }
            }
        }
        return (this.convertPitch(this.pitch, tabAccidentals));
    }
    
    convertPitch(input, tabAccidentals){
        let value = input;
        let note ='b';
        let height ='4';
        let accidental = '';
        if (this.isAccidental) {
            if (this.accident === 'sharp'){
                console.log('ADDED SHARP TO TAB ACCIDENTALS');
                tabAccidentals.sharp.push(value);
                accidental = '#';
                value -= 1;
            } else if (this.accident === 'flat'){
                tabAccidentals.flat.push(value)
                accidental = 'b';
                value += 1;
            } else if (this.accident === 'natural'){
                accidental = 'n';
                tabAccidentals.natural.push(value);
            } 
        } else if (tabAccidentals.sharp.includes(value)){
            value -= 1;
        } else if (tabAccidentals.flat.includes(value)) {
            value += 1;
        }
        if (value % 12 === 0)
        {
            note = "c";
            height = value / 12 - 1;
        }
        if ((value - 2) % 12 === 0)
        {
            note = "d";
            height = (value - 2) / 12 - 1;
        }
        if ((value - 4 )% 12 === 0)
        {
            note = "e";
            height = (value - 4) / 12 - 1;
        }
        if ((value - 5 )% 12 === 0)
        {
            note = "f";
            height = (value - 5) / 12 - 1;
        }
        if ((value - 7) % 12 === 0)
        {
            note = "g";
            height = (value - 7) / 12 - 1;
        }
        if ((value - 9) % 12 === 0)
        {
            note = "a";
            height = (value - 9) / 12 - 1;
        }
        if ((value - 11) % 12 === 0)
        {
            note = "b";
            height = (value - 11) / 12 - 1;
        }
        if (note === 'bbb') {
            console.log('pitch wasnt properly converted')
        }
        return (note + accidental + '/' + height);
    }

}