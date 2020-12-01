import express from 'express'
import cors from 'cors'
import { recognize } from "node-tesseract-ocr"
import multer from 'multer';

export default class Server {
	constructor(cardParser) {
		this.cardParser = cardParser;
		this.port = 3000;
		
		this.server = express();
		this.server.use(express.json())
		this.server.use(cors())

		// this.server.get('/', (req, res) => res.send('Welcome to buisness card parser! Try the routes /text & /image'));
		this.server.use(express.static('client'));

		this.server.post('/text', async (req, res) => {
			if(req.body.text)
				try {
					const data = cardParser.getContactInfo(req.body.text);
					res.send(JSON.stringify(await data.toJSON()));
				} catch(error) {
					res.status(500).send("An error occoured processing this request :(\n" + error.message);
				}
			else
				res.status(400).send('Please provide your text in the text property of the body of the response.')
		});

		this.server.post('/image', multer({dest: 'cards'}).single('image'), async (req, res) => {
			try {
				const resultOCR = await recognize(req.file.path, {
					lang: "eng",
					oem: 1, // Use NNet LTSM mode
					psm: 1, // Use sparce text / OCD
				});
				const data = cardParser.getContactInfo(resultOCR);
				res.send(await data.toJSON());
			} catch(error) {
				res.status(500).send(error.message)
			}
		});

		this.server.listen(this.port, () => {
			console.log(`Listening on port ${this.port}`);
		});
	}
}