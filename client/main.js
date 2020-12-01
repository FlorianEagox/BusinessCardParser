const btnParse = document.querySelector('#btnParse');
const txtText = document.querySelector('#txtText');
const fileImage = document.querySelector('#fileImage');
const serverURL = 'http://localhost:3000';
const imageMode = true;

btnParse.addEventListener('click', async () => {
	let options;
	if(!imageMode)
		options = {
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({text: txtText.value}),
		}
	else {
		const form = new FormData();
		form.append("image", fileImage.files[0]);
		options = {
			body: form
		}
	}
	try {
		const cardData = await fetch(`${serverURL}/${imageMode ? 'image' : 'text'}`, {method: 'POST', ...options})
		if(cardData.ok)
			console.log(await cardData.json());
	} catch(error) {
		console.log(error)
	}
});