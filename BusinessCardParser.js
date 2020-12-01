import ContactInfo from './ContactInfo.js'
import { readFileSync } from 'fs';

export default class BusinessCardParseress {
	constructor() {
		// To detect names, this program uses a dataset of first and last names.
		this.names = [readFileSync('first names.txt', 'utf8'), readFileSync('last names.txt', 'utf8')] // Read both files
			.map(nameList => nameList.split('\n')); // Convert them from \n seperated strings to arrays
	}
	getContactInfo(document) {
		return new ContactInfo(document, this.names);
	}
}