
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