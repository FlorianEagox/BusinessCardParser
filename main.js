import BusinessCardParser from './BusinessCardParser.js'
import {config} from 'dotenv'
import Server from './Server.js'
config();

const cardParser = new BusinessCardParser();
if(process.argv.includes('-s')) { // Test if the user provided any text
	const info = cardParser.getContactInfo(process.argv[3]); // Pass in the 2nd argument 
	console.log(await info.toString());
} else {
	const server = new Server(cardParser);
}
