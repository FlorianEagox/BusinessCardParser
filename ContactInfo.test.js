import BusinessCardParser from './BusinessCardParser.js'

const cardParser = new BusinessCardParser();
const tests = [
	{
		input: ``,
		name: null,
		phone: null,
		email: null
	},
	{
		input:
`ASYMMETRIK LTD
Mike Smith
Senior Software Engineer
(410)555-1234
msmith@asymmetrik.com`,
		name: 'Mike Smith',
		phone: '4105551234',
		email: 'msmith@asymmetrik.com'
	},
	{
		input: 
`Foobar Technologies
Analytic Developer
Lisa Haung
1234 Sentry Road
Columbia, MD 12345
Phone: 410-555-1234
Fax: 410-555-4321
lisa.haung@foobartech.com`,
		name: 'Lisa Haung',
		phone: '4105551234',
		email: 'lisa.haung@foobartech.com'
	},
	{
		input:
`Arthur Wilson
Software Engineer
Decision & Security Technologies
ABC Technologies
123 North 11th Street
Suite 229
Arlington, VA 22209
Tel: +1 (703) 555-1259
Fax: +1 (703) 555-1200
awilson@abctech.com`,
		phone: '17035551259',
		email: 'awilson@abctech.com'
	}
];
const cards = tests.map(card => cardParser.getContactInfo(card.input));
test('Test Phone Numbers', () => {
	cards.forEach((card, index) => expect(card.getPhoneNumber()).toBe(tests[index].phone))
});
test('Test Names', () => {
	cards.forEach(async (card, index) => expect(await card.getName()).toBe(tests[index].name))
});
test('Test Emails', () => {
	cards.forEach((card, index) => expect(card.getEmailAddress()).toBe(tests[index].email))
});