import Card from "./Card.js";

const serverURL = 'https://sethpainter.com/businesscardparser';
const rdbMode = document.querySelector('#rdb-text');
const txtText = document.querySelector('#txt-text');
const fileImage = document.querySelector('#file-image');
const elErrorBox = document.querySelector('#error-box');
const elError =	document.querySelector('#error');
const loader = document.querySelector('#loader');
const currentCard = document.querySelector('#current-card');

document.querySelector('#btn-parse').addEventListener('click', parseCard);
async function parseCard() {
	let options; // options for the request
	const textMode = rdbMode.checked; // tells us which tab is selected
	if(textMode) { // We're uploading card text
		if(txtText.value)
			options = {
				headers: { "content-type": "application/json" },
				body: JSON.stringify({text: txtText.value})
			};
		else {
			displayError('You must enter the text to send');
			return;
		}
	} else { // we're uploading an image
		if(!fileImage.files[0]) {
			displayError('You must upload an image!');
			return;
		}
		const form = new FormData();
		form.append("image", fileImage.files[0]);
		options = { body: form };
	}
	try {
		loader.classList.add('loader');
		const cardData = await fetch(`${serverURL}/${textMode ? 'text' : 'image'}`, {method: 'POST', ...options})
		if(cardData.ok)
			displayCard(await cardData.json());
		else
			displayError(`${cardData.status}: ${await cardData.text()}`);
	} catch(error) {
		displayError(error);
	}
}
fileImage.addEventListener('change', e => {
	const elFileName = document.querySelector('#lbl-filename');
	if(e.target.files[0])
		elFileName.textContent = e.target.files[0].name;
});

function displayCard(cardData) {
	if(!Object.values(cardData).every(o => o === null)) // If the object actually has some stuff
		document.querySelector('#btn-save').classList.remove('hidden');
	currentCard.update(cardData);
	loader.classList.remove('loader');
}
function displayError(error) {
	console.error(error);
	elError.innerHTML = error;
	elErrorBox.classList.add('active');
	setTimeout(() => elErrorBox.classList.remove('active'), 5000);
	loader.classList.remove('loader');
}
document.querySelector('#btn-save').addEventListener('click', () => currentCard.save());

function clearCards() {
	localStorage.clear('key');
	displaySavedCards();
}
document.querySelector('#btn-clear').addEventListener('click', clearCards);

// Display the saved cards
export function displaySavedCards() {
	const cardHolder = document.querySelector('#card-holder');
	cardHolder.innerHTML = '';
	if(localStorage.getItem('cards')) {
		const cards = JSON.parse(localStorage.getItem('cards'));
		if(cards.length > 0) {
			cards.forEach(card => {
				cardHolder.appendChild(new Card(card));
			});
			console.log('HI!')
			cardHolder.parentElement.classList.remove('hidden');
		}
	} else {
		cardHolder.parentElement.classList.add('hidden');
	}
}
displaySavedCards();