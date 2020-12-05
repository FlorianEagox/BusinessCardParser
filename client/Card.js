import { updateSavedCardsDisplay, displayAlert, serverURL, loader } from './main.js'

export default class Card extends HTMLElement {
	constructor(cardData=null) { // The first card, #currentCard is initialized without data which is added later
		super();
		const template = document.querySelector('#card-template').content;
		this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true)); // Set the shadow root to the template
		// Get reference to all the slots defined in the template
		this.lblName = this.shadowRoot.querySelector('[name=name]');
		this.lblPhone = this.shadowRoot.querySelector('[name=phone]');
		this.lblEmail = this.shadowRoot.querySelector('[name=email]');

		this.btnSave = this.shadowRoot.querySelector('#btn-save');
		this.btnSave.addEventListener('click', () => this.save());

		this.btnSend = this.shadowRoot.querySelector('#btn-send');
		this.btnSend.addEventListener('click', () => this.send());

		if(cardData) { // These are the cards in the saved cards display
			this.cardData = cardData;
			// currentCard doesn't get a delete button
			const btnDelete = this.shadowRoot.querySelector('#btn-delete');
			btnDelete.addEventListener('click', () => this.delete());
			btnDelete.classList.remove('hidden');
			this.update();
		}
	}
	getSavedCards() {
		return JSON.parse(localStorage.getItem('cards')) || [];
	}
	update(cardData=null) { // Update the card's labels w/ its data and show buttons.
		if(cardData) { // The saved cards aren't updated w/ data. For the #current-card
			this.cardData = cardData;
			this.btnSave.classList.remove('hidden'); // #current-card has a save btn
		}
		// update the template slots w/ the text & links
		const {name, phone, email} = this.cardData;
		this.lblName.textContent = name;
		this.lblPhone.textContent = phone;
		this.lblPhone.parentElement.href = `tel:${phone}`;
		this.lblEmail.textContent = email;
		this.lblEmail.parentElement.href = `mailto:${email}`;

		// both types of buttons have a send btn
		this.btnSend.classList.remove('hidden');
	}
	save() { // TODO: Not this
		// put current card in as string so it will get rejected if duplicate
		let cards = new Set(this.getSavedCards().map(card => JSON.stringify(card)));
		 // put current card in as string so it will get rejected if duplicate
		cards.add(JSON.stringify(this.cardData));
		// convert the string cards to objects and then the whole array to set
		localStorage.setItem('cards', JSON.stringify(Array.from(cards).map(card => JSON.parse(card))));
		updateSavedCardsDisplay();
	}
	async send() { // Request the API to email me to an email address the user provides
		const email = prompt('Email to send contact');
		if(email) {
			try {
				loader.classList.add('loader');
				const emailRequest = await fetch(`${serverURL}/email`, {
					method: 'POST',
					headers: {'content-type': 'application/json'},
					body: JSON.stringify({email, card: this.cardData})
				});
				const response = await emailRequest.text();
				if(emailRequest.ok)
					displayAlert(response, false);
				else
					displayAlert(`${emailRequest.status}: ${response}`);
			} catch(error) {
				displayAlert(error);
			}
		}
	}
	delete() {
		const cards = this.getSavedCards().filter(card => { // Go through every card to to find one that has the same values as me
			return !Object.values(card).every(val => { // Check every value of me and the current card
				return Object.values(this.cardData).includes(val) // check if the current value is in both cards.
			})
		});
		if(cards.length) // If we deleted the last card, delete the whole key, otherwise just update it
			localStorage.setItem('cards', JSON.stringify(cards));
		else
			localStorage.removeItem('cards');
		updateSavedCardsDisplay();
	}
}
customElements.define('buisness-card', Card);
