const serverURL = 'https://sethpainter.com/businesscardparser';
const rdbMode = document.querySelector('#rdb-text');
const txtText = document.querySelector('#txt-text');
const fileImage = document.querySelector('#file-image');
const btnParse = document.querySelector('#btn-parse');
const elErrorBox = document.querySelector('#error-box');
const elError =	document.querySelector('#error');
const loader = document.querySelector('#loader');


btnParse.addEventListener('click', async () => {
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
});

fileImage.addEventListener('change', e => {
	const elFileName = document.querySelector('#lbl-filename');
	if(e.target.files[0])
		elFileName.textContent = e.target.files[0].name;
});

function displayCard(cardData) {
	const lblEmail = document.querySelector('#lbl-email');
	const lblPhone = document.querySelector('#lbl-phone');
	const lblName = document.querySelector('#lbl-name');
	const {name, phone, email} = cardData
	lblName.textContent = name;
	lblPhone.textContent = phone;
	lblPhone.href = `tel:${phone}`;
	lblEmail.textContent = email;
	lblEmail.href = `mailto:${email}`;
	loader.classList.remove('loader');
}
function displayError(error) {
	console.error(error);
	elError.innerHTML = error;
	elErrorBox.classList.add('active');
	setTimeout(() => elErrorBox.classList.remove('active'), 5000);
	loader.classList.remove('loader');
}
