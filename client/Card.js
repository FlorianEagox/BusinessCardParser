import { displaySavedCards, displayAlert, serverURL, loader } from './main.js'

export default class Card extends HTMLElement {
	constructor(cardData=null) {
		super();
		const template = document.getElementById('card-template').content;
		const root = this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));
		this.lblName = this.shadowRoot.querySelector('[name=name]');
		this.lblPhone = this.shadowRoot.querySelector('[name=phone]');
		this.lblEmail = this.shadowRoot.querySelector('[name=email]');
		if(cardData) {
			this.cardData = cardData;
			// We only want the delete button when the card is created manually
			const btnDelete = this.shadowRoot.querySelector('#btn-delete');
			btnDelete.addEventListener('click', () => this.delete());
			btnDelete.classList.remove('hidden');
			this.update();
		}
	}
	update(cardData=null) {
		if(cardData)
			this.cardData = cardData;
		const {name, phone, email} = this.cardData;
		this.lblName.textContent = name;
		this.lblPhone.textContent = phone;
		this.lblPhone.parentElement.href = `tel:${phone}`;
		this.lblEmail.textContent = email;
		this.lblEmail.parentElement.href = `mailto:${email}`;

		const btnSend = this.shadowRoot.querySelector('#btn-send');
		btnSend.addEventListener('click', () => this.send());
		btnSend.classList.remove('hidden');

	}
	save() {
		const cards = JSON.parse(localStorage.getItem('cards')) || [];
		cards.push(this.cardData);
		localStorage.setItem('cards', JSON.stringify(cards));
		displaySavedCards();
	}
	async send() {
		const email = prompt('Email to send contact');
		if(email) {
			try {
				loader.classList.add('loader');
				const emailRequest = await fetch(`${serverURL}/email`, {
					method: 'POST',
					headers: {'content-type': 'application/json'},
					body: JSON.stringify({email, card: this.cardData})
				});
				if(emailRequest.ok)
					displayAlert(`Email sent to\n${email}`, false);
				else
					displayAlert(`${emailRequest.status}: ${await emailRequest.text()}`);
			} catch(error) {
				displayAlert(error);
			}
		}
	}
	delete() {
		const cards = JSON.parse(localStorage.getItem('cards')) || [];
		localStorage.setItem('cards', JSON.stringify(cards.filter(
			card => JSON.stringify(card) == JSON.stringify(this.cardData)
		)));
		displaySavedCards();
	}
}
customElements.define('buisness-card', Card);
