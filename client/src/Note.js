export default class Note {

    constructor(pitch, isAccidental, accident, armor, tabAccidentals){
        this.pitch = pitch;
        this.isAccidental = isAccidental;
        this.accident = accident;
    }

    init(){
        this.pitch = 60;
    }
    
    up(armor) {
        this.pitch += 1;
        while (this.getAccident(armor).isAccidental){
            this.pitch += 1;
        }
        this.isAccidental = false;
        this.accident = this.getAccident(armor).accident;
    }

    down(armor) {
        this.pitch -= 1;
        while (this.getAccident(armor).isAccidental){
            this.pitch -= 1;
        }
        this.isAccidental = false;
        this.accident = this.getAccident(armor).accident;
    }

    getAccident(valueArmor){
        const sharpArmor = [-6, -1, -8, -3, -10, -5, -12];
        const flatArmor = [-10, -3, -8, -1, -6, 1, -4];
        const noArmorSharp = [-5, 0, -7, -2, -9, -4, -11];
        const noArmorFlat = [-11, -4, -9, -2, -7, 0, -5]
    
        if (valueArmor >= 0)
        {
            for (let i=0; i < sharpArmor.length ;i++)
            {
                if ( i < valueArmor && (this.pitch + sharpArmor[i]) % 12 === 0){
                    return ({accident: 'sharp', isAccidental: false});
                } else if (i >= valueArmor && (this.pitch + noArmorSharp[i]) % 12 === 0){
                    return ({accident: 'natural', isAccidental: false});
                }
            }
        }
        if (valueArmor < 0)
        {
            for (let i=0; i < flatArmor.length; i++)
            {
                if (i < -valueArmor && (this.pitch + flatArmor[i]) % 12 === 0) {
                    return ({accident: 'flat', isAccidental: false});	
                } else if (i >= -valueArmor && (this.pitch + noArmorFlat[i]) % 12 === 0) {
                    return ({accident: 'natural', isAccidental: false});
                }
            }
        }
        return ({accident:'unknown', isAccidental: true});
    }

    setAccident(accidental, valueArmor) {
        console.log('set Accident ' , accidental, 'on', this);
        if ( this.accident === 'sharp'){
            console.log('note origin accident = sharp')
            if (accidental === 'flat'){
                console.log('note new accident= flat');
                this.pitch -= 2;
                this.accident = 'flat';
            } else if (accidental === 'natural') {
                console.log('note new accident = natural');
                this.pitch -= 1;
                this.accident = 'natural';
            }
            
        } else if (this.accident === 'flat'){
            console.log('note origin accident = flat')
            if (accidental === 'sharp'){
                console.log('note new accident=sharp')
                this.pitch += 2;
                this.accident = 'sharp';
            } else if (accidental === 'natural') {
                console.log('note new accident=natural')
                this.pitch += 1;
                this.accident = 'natural';
            }
        } else if (this.accident === 'natural') {
            console.log('note origin accident = natural');
            if (accidental === 'flat'){
                console.log('note new accident=flat')
                this.pitch -= 1;
                this.accident = 'flat';
            } else if (accidental === 'sharp') {
                console.log('note new accident=sharp')
                this.pitch += 1;
                this.accident = 'sharp';
            }
        }
        console.log('after update:', this.getAccident(valueArmor));
        this.isAccidental = this.getAccident(valueArmor).isAccidental;
    }

    getStringValue(valueArmor, tabAccidentals){
        console.log(tabAccidentals);
        const sharpArmor = [-6, -1, -8, -3, -10, -5, -12];
        const flatArmor = [-10, -3, -8, -1, -6, 1, -4];
    
        if (valueArmor > 0)
        {
            for (let i=0; i < valueArmor;i++)
            {
                if ((this.pitch + sharpArmor[i]) % 12 === 0) {
                    if (this.isAccidental && this.accident === 'sharp') {
                        return (this.convertPitch(this.pitch, tabAccidentals));
                    }
                    return (this.convertPitch(this.pitch - 1, tabAccidentals));
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
                    return (this.convertPitch(this.pitch + 1, tabAccidentals));
                }
            }
        }
        return (this.convertPitch(this.pitch, tabAccidentals));
    }
    
    convertPitch(input, tabAccidentals){
        let value = input;
        let note ='bbb';
        let height ='4';
        let accidental = '';
        if (this.isAccidental) {
            if (this.accident === 'sharp'){
                tabAccidentals.sharp.push(value);
                accidental = '#';
                value -= 1;
            } else if (this.accident === 'flat'){
                tabAccidentals.flat.push(value)
                accidental = 'b';
                value += 1;
            } else if (this.accident === 'natural'){
                accidental = 'n';
                if (tabAccidentals.flat.includes(value - 1)){
                    tabAccidentals.flat.splice(tabAccidentals.flat.indexOf(value - 1))
                }
                if (tabAccidentals.sharp.includes(value + 1)){
                    tabAccidentals.sharp.splice(tabAccidentals.flat.indexOf(value + 1))
                }
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