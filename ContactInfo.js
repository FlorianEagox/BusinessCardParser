export default class ContactInfo {
	constructor(document, names) {
		this.document = document;
		this.names = names;
	}
	// Returns the full name of the business card
	async getName() { 
		return new Promise((resolve, reject) => { // we have to search through a lot of data, this can take awhile, so we should use a promise.
			// A regex query that looks for two words that both start with captial letters seperated by space or \n. Allows many unique name characters.
			this.document.match(/(\b[A-Z][a-zA-z.']*\b\s\b[A-Z][a-zA-Z-'.]*\b)/g)?.forEach(nameSet => { // Loop through all possible results of regex query
				const strippedNames = nameSet.split(' ').map(name => name.toLowerCase()); // Our dataset is lowercase, so we need to make our convert our names.
				if(this.names[0].includes(strippedNames[0]) && this.names[1].includes(strippedNames[1])) // If the dataset includes the first and last name, it's a name
					resolve(nameSet);
			});
			resolve(null); // If we didn't find a name in the string, return null
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
}