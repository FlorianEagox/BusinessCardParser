import BusinessCardParser from './BusinessCardParser.js'

const cardParser = new BusinessCardParser();
if(process.argv[2]) { // Test if the user provided any text
	const info = cardParser.getContactInfo(process.argv[2]); // Pass in the 2nd argument 
	console.log(await info.toString());
} else
	console.log('No text found. Please provide the text of a business card to parse');