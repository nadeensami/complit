import { useState } from "react";
import nouns from "./nouns.json";
import "./App.css";
import pos from "wink-pos-tagger";
import pluralize from "pluralize";

const App = () => {
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");
	const tagger = pos();

	const convertText = () => {
		const inputLines = inputText.split("\n");

		const convertedText = inputLines.map((inputLine) => convertLine(inputLine)).join("\n");

		setOutputText(convertedText);
	};

	const convertLine = (input) => {
		const output = input
			.split(" ")
			.map((word) => {
				const taggedWord = tagger.tagSentence(word);

				return taggedWord
					.map((taggedSegment) => {
						if (taggedSegment.pos === "NN") {
							return convertNoun(taggedSegment.value);
						} else if (taggedSegment.pos === "NNS") {
							const singWord = pluralize.singular(taggedSegment.value);
							const convertedNoun = convertNoun(singWord);
							return pluralize.plural(convertedNoun);
						} else {
							return taggedSegment.value;
						}
					})
					.join("");
			})
			.join(" ");

		return output;
	};

	return (
		<div className="App">
			<header>
				<h1>N+7 Generator</h1>
				<div className="line" />
				<p>A tool to transform an input text using the OuLiPotan constraint, N+7.</p>
				<p>For N+7, every noun is converted to a noun that is 7 after it in the dictionary.</p>
			</header>
			<label htmlFor="textInput">Enter the text you would like to convert:</label>
			<textarea
				id="textInput"
				name="textInput"
				onChange={(e) => setInputText(e.target.value)}
			></textarea>
			<button onClick={() => convertText()}>Convert the text!</button>
			{outputText && <h2>Here is your converted text:</h2>}
			<p className="output">{outputText}</p>
		</div>
	);
};

const convertNoun = (noun) => {
	let index = nouns.indexOf(noun);

	if (index < 0) {
		console.log(noun);
		return noun;
	}
	return nouns[(index + 7) % nouns.length];
};

export default App;
