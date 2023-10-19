import Papa from "papaparse";

var alphabetized = null;

async function fetchData(char) {
    var data = null;
    const response = await fetch("https://raw.githubusercontent.com/Riley229/IMDb-dataset-filtered/main/imdb.titles.csv");
    
    data = await response.text();
    data = Papa.parse(data, { header: true }).data;
    alphabetized = {};

    for (let i = 0; i < 26; i++) {
        const char = String.fromCharCode(97 + i);
        alphabetized[char] = data
            .filter((/** @type {{ title: string; }} */ item) => item.title.substring(0, 1).toLowerCase() === char)
            .map((/** @type {{ title: string; }} */ item) => item.title ?? "");
    }
}

function GetSearchSuggestions(input) {
    const keyword = input.toLowerCase();
    const suggestions = [];

    if (keyword === '' || keyword.startsWith('.')) {
        return [];
    } else if (alphabetized === null) {
        fetchData();
        return [];
    }
    
    const firstChar = keyword.substring(0, 1).toLowerCase();
    return alphabetized[firstChar].filter((title) => title.toLowerCase().startsWith(keyword));
}

export default GetSearchSuggestions;