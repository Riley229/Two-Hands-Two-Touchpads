import Papa from "papaparse";

var data = null;

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/xxittysnxx/Data-Visualization/main/data.csv");
    data = await response.text();
    data = Papa.parse(data, { header: true }).data;
}

function GetSearchSuggestions(input) {
    const keyword = input.toLowerCase();
    const suggestions = [];

    if (data == null) {
        fetchData();
        return [];
    } else if (keyword === '') {
        return [];
    }
    
    // iterate over each csv entry and match with keyword
    data.forEach((/** @type {{ title: string; }} */ item) => {
        const csvKeyword = item.title && item.title.toLowerCase();
        
        if (csvKeyword && (csvKeyword.startsWith(keyword)))
            suggestions.push(item.title);
    });

    return suggestions;
}

export default GetSearchSuggestions;