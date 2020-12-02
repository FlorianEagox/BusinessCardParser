# Business Card Parser

A fullstack app that provides an API & frontend for scraping data from business cards

This was initially created for a code test in a job interview, but I've extended the functionality into its own project.

## How it works

Each of these tasks employs regular expressions to detect the particular data.

The function to find a phone number uses one to find the number, and another to transform it into the desired specification.

If you provide an image, it will be scanned with Tesseract OCR and then the text will be processed.

### Detecting names

This was the trickiest part. In order to detect names, the program first runs a query to find text int he format of a name (two consecutive proper nouns). Because there are many possible matches for this, the program finds all of them and then then searches for both the first and last name in a dataset of first and last names to make sure it's actually a name.
Because the program uses a datadet (around 260k names), the validation process can take awhile, so this function is asynchronous and promise based.

[Data set used](https://github.com/philipperemy/name-dataset)

## How to use

### Single Use Mode
To run the program from the command line, you can either run
```
npm run start -s "<Business Card Text>"
```
or
```
node main.js -s "<Business Card Text>"
```

### Server mode

Running
```
npm run server
```
Will create a server with the API running and the client being served at `/`

## API

```
POST /text
```

Provide the text of the card as a JSON object in the body like this:
```
{"text": "<Business Card Text>"}
```

```
POST /image
```
You'll need to provide the image as a field with the name `image`
The content-type must be `multipart/form-data`.

## Testing
Unit tests are written with the Jest framework
It comes with a few existing tests, and more can be added to the tests array
You first need to install the test module with
```
npm i
```
and you can run it with
```
npm test
```

## Possible improvements
The biggest improvement that could be made to this program is a broader better way to identify names. This will primarily work only with english names, and although it does provide suppport for edge cases such as Billy O'Nille, Gabriel Mendez-Frances, and others, there's no garuntee every name will be in the dataset. It also might struggle with initialis or business cards with middle names.

The program could also probably load the name dataset files in a stream or asynchronously or at the same time to speed up performance.

CardParser's constructor could be abstracted to parse the data in a different way (maybe by fetching it) so the code could be used both on a server and in a browser.

I could also extend the scraping to include addresses but this would be more complicated.