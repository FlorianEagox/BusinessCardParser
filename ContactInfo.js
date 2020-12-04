export default class ContactInfo {
	constructor(document, names) {
		this.document = document;
		this.names = names;
	}
	// Returns the full name of the business card
	async getName() { 
		return new Promise((resolve, reject) => { // we have to search through a lot of data, this can take awhile, so we should use a promise.
			// A regex query that looks for all proper nouns including possible name characters
			const properNouns = this.document.match(/(\b[A-Z][a-zA-z.']*\b)/g);
			for(let i = 0; i < properNouns.length - 1; i++) { // Go through every set of two proper nouns
				const nameSet = [properNouns[i], properNouns[i+1]]; // Create an array with the current two nouns
				const strippedNames = nameSet.map(name => name.toLowerCase()); // Our dataset is lowercase, so we need to make our convert our names.
				if(this.names[0].includes(strippedNames[0]) && this.names[1].includes(strippedNames[1])) // If the dataset includes the first and last name, it's a name
					resolve(nameSet.join(' '));
			}
			const titleCaseLine = this.document.match(/^[A-Z][a-z]*(.[A-Z][a-z]*)*\n/m);
			resolve(titleCaseLine || null); // If we didn't find a name in the string, return null
		});
	}
	// Gets the phone number from the card text
	getPhoneNumber() {
		// Run a regex query to find the email address;
		//this query looks for three or four sets of digits, the first three digit set possibly wrapped with (), each optionally seperated with space, or -, and the last set with 4 digits.
		return this.document.match(/(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{4})(?:[-. ]*(\d+))?)/g)?.[0]
			.replace(/\D+/g, '') || null; // Remove anything that's not a number to fit the specified format
	}
	// Gets the email from the card text
	getEmailAddress() {
		// Run a regex query to find the email address;
		return this.document.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)?.[0] || null; // Query looks for three strings with alphanumerics, -, and _ sperated by an @ and .
	}
	// Returns data as easy to read text
	async toString() {
		return Promise.resolve(
`Name: ${await this.getName()}
Phone: ${this.getPhoneNumber()}
Email: ${this.getEmailAddress()}`
		);
	}
	async toJSON() {
		return Promise.resolve({
			name: await this.getName(),
			email: this.getEmailAddress(),
			phone: this.getPhoneNumber()
		});
	}
}