import express from 'express'
import cors from 'cors'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import multer from 'multer';
import morgan from 'morgan';

export default class Server {
	constructor(cardParser) {
		this.cardParser = cardParser;
		this.port = 5005;
		this.client = new ImageAnnotatorClient();

		this.server = express();
		this.server.use(cors());
		this.server.use(express.json());
		this.server.use(morgan('tiny'));

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
				const resultOCR = await this.ocrImage(req.file.path);
				console.log(resultOCR);
				const data = cardParser.getContactInfo(resultOCR);
				res.send(await data.toJSON());
			} catch(error) {
				console.error(error);
				res.status(500).send(error.message)
			}
		});

		this.server.listen(this.port, () => {
			console.log(`Listening on port ${this.port}`);
		});
	}
	async ocrImage(fileName) {
		const [result] = await this.client.textDetection(fileName);
		const detections = result.textAnnotations;
		
		return detections[0]?.description || null;
	}
}
