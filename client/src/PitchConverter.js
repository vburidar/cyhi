
export function isAccidental(pitch, valueArmor){
	const sharpArmor = [-6, -1, -8, -3, -10, -5, -12];
	const flatArmor = [-10, -3, -8, -1, -6, 1, -4];
	const noArmorSharp = [-5, 0, -7, -2, -9, -4, -11];
	const noArmorFlat = [-11, -4, -9, -2, -7, 0, -5]

	if (valueArmor >= 0)
	{
		for (let i=0; i < sharpArmor.length ;i++)
		{
			if ( i < valueArmor && (pitch + sharpArmor[i]) % 12 === 0){
				return (false);
			} else if (i >= valueArmor && (pitch + noArmorSharp[i]) % 12 === 0){
				return (false);
			}
		}
	}
	if (valueArmor < 0)
	{
		for (let i=0; i < flatArmor.length; i++)
		{
			if (i < -valueArmor && (pitch + flatArmor[i]) % 12 === 0) {
				return (false);	
			} else if (i >= -valueArmor && (pitch + noArmorFlat[i]) % 12 === 0) {
				return (false)
			}
		}
	}
	return (true);
}

export function convertArmor(value, valueArmor, note, tabAccidentals){
	const sharpArmor = [-6, -1, -8, -3, -10, -5, -12];
	const flatArmor = [-10, -3, -8, -1, -6, 1, -4];

	if (valueArmor > 0)
	{
		for (let i=0; i < valueArmor;i++)
		{
			if ((value + sharpArmor[i]) % 12 === 0) {
				if (note.Accidental && note.Accidental[0].subtype[0] === 'accidentalSharp') {
					return (convertPitch(value, note, tabAccidentals));
				}
				return (convertPitch(value - 1, note, tabAccidentals));
			}
		}
	}
	if (valueArmor < 0)
	{
		for (let i=0; i < -valueArmor; i++)
		{
			if ((value + flatArmor[i]) % 12 === 0) {
				if (note.Accidental && note.Accidental[0].subtype[0] === 'accidentalFlat') {
					return (convertPitch(value, note, tabAccidentals));
				}
				return (convertPitch(value + 1, note, tabAccidentals));
			}
		}
	}
	return (convertPitch(value, note, tabAccidentals));
}

export function getKeySignature(armorValue)
{
	if (armorValue === 0)
		return ("C");
	if (armorValue === 1)
		return ("G");
	if (armorValue === 2)
		return ("D");
	if (armorValue === 3)
		return ("A");
	if (armorValue === 4)
		return ("E");
	if (armorValue === 5)
		return ("B");
	if (armorValue === 6)
		return ("F#");
	if (armorValue === 7)
		return ("C#");
	if (armorValue === -1)
		return ("F");
	if (armorValue === -2)
		return ("Bb");
	if (armorValue === -3)
		return ("Eb");
	if (armorValue === -3)
		return ("Eb");
	if (armorValue === -4)
		return ("Ab");
	if (armorValue === -5)
		return ("Db");
	if (armorValue === -6)
		return ("Gb");
	if (armorValue === -7)
		return ("Cb");
	return ("C");
	}

export function convertPitch(input, noteObj, tabAccidentals){
	let value = input;
	let note ='h';
    let height ='4';
    let accidental = '';
	if (noteObj.Accidental) {
        if (noteObj.Accidental[0].subtype[0] === 'accidentalSharp'){
			tabAccidentals.sharp.push(value);
			accidental = '#';
            value -= 1;
        } else if (noteObj.Accidental[0].subtype[0] === 'accidentalFlat'){
			tabAccidentals.flat.push(value)
			accidental = 'b';
            value += 1;
        } else if (noteObj.Accidental[0].subtype[0] === 'accidentalNatural'){
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
    return (note + accidental + '/' + height);
}