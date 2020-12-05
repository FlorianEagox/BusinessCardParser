import Card from "./Card.js";

export const serverURL = 'https://sethpainter.com/businesscardparser';
const rdbMode = document.querySelector('#rdb-text');
const txtText = document.querySelector('#txt-text');
const fileImage = document.querySelector('#file-image');

export const loader = document.querySelector('#loader');
const currentCard = document.querySelector('#current-card');

// When the parse button is clicked, send the image to the server and display the results
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
			displayAlert('You must enter the text to send');
			return;
		}
	} else { // we're uploading an image
		if(!fileImage.files[0]) {
			displayAlert('You must upload an image!');
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
			displayAlert(`${cardData.status}: ${await cardData.text()}`);
	} catch(error) {
		displayAlert(error);
	}
}

// When an image is added, show the filename to indicate
fileImage.addEventListener('change', e => {
	const elFileName = document.querySelector('#lbl-filename');
	if(e.target.files[0])
		elFileName.textContent = e.target.files[0].name;
});

// Update current card, giving it data and adding buttons
function displayCard(cardData) {
	currentCard.update(cardData);
	loader.classList.remove('loader');
}

// Reveal and add text to the alert display
export function displayAlert(alert, error=true) {
	const elAlertBox = document.querySelector('#alert-box');
	if(error)
		console.error(alert);
	else
		console.log(alert);
	elAlertBox.innerHTML = alert;

	// Either toggle alert or success if the alert is an error
	elAlertBox.classList.toggle('error', error);
	elAlertBox.classList.toggle('success', !error);

	elAlertBox.classList.add('active');	 // make the alert visible
	setTimeout(() => elAlertBox.classList.remove('active'), 5000); // Hide the alert in a few seconds
	loader.classList.remove('loader'); // Hide the loader after a fetch
}

// Remove all saved cards
document.querySelector('#btn-clear').addEventListener('click', () => {
	localStorage.removeItem('key');
	updateSavedCardsDisplay();
});

// Display the saved cards
export function updateSavedCardsDisplay() {
	const cardHolder = document.querySelector('#card-holder');
	cardHolder.innerHTML = '';
	if(localStorage.getItem('cards')) {
		const cards = JSON.parse(localStorage.getItem('cards'));
		cards.forEach(card => cardHolder.appendChild(new Card(card)));
		cardHolder.parentElement.classList.remove('hidden');
	} else
		cardHolder.parentElement.classList.add('hidden');
}
updateSavedCardsDisplay();
