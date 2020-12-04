import { displaySavedCards } from './main.js'

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
			this.update();
			// We only want the delete button when the card is created manually
			const btnDelete = this.shadowRoot.querySelector('#btn-delete');
			btnDelete.addEventListener('click', this.delete);
			btnDelete.classList.remove('hidden');
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

	}
	save() {
		const cards = JSON.parse(localStorage.getItem('cards')) || [];
		cards.push(this.cardData);
		localStorage.setItem('cards', JSON.stringify(cards));
		displaySavedCards();
	}
	delete() {
		const cards = JSON.parse(localStorage.getItem('cards')) || [];
		console.log(cards)
		localStorage.setItem('cards', JSON.stringify(cards.filter(
			card => JSON.stringify(card) == JSON.stringify(this.cardData)
		)));
		displaySavedCards();
	}
}
customElements.define('buisness-card', Card);
