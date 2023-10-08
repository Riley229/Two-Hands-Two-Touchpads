const searchBox = document.getElementById('inputText');
const suggestions = document.getElementById('suggestions');

searchBox.addEventListener('input', async () => {
    // @ts-ignore
    const keyword = searchBox.value.toLowerCase();
    suggestions.innerHTML = '';

    const response = await fetch("https://raw.githubusercontent.com/xxittysnxx/Data-Visualization/main/data.csv");
    const data = await response.text();

    // @ts-ignore
    const csvData = Papa.parse(data, { header: true }).data;
    var tmp = keyword;

    while(suggestions.innerHTML === '') {
        if(tmp === '')
            break;
        csvData.forEach((/** @type {{ title: string; }} */ item) => {
            const csvKeyword = item.title && item.title.toLowerCase();
            if (tmp === '') {
                suggestions.innerHTML = '';
            } else if (csvKeyword && (csvKeyword.startsWith(tmp))) {
                const suggestionItem = document.createElement('div');
                suggestionItem.textContent = item.title;
                suggestionItem.classList.add('suggestion-item');
                suggestions.appendChild(suggestionItem);
    
                suggestionItem.addEventListener('click', () => {
                    // @ts-ignore
                    searchBox.value = item.title;
                    suggestions.innerHTML = '';
                });
    
                suggestionItem.addEventListener('mouseenter', () => {
                    suggestionItem.classList.add('hovered');
                });
    
                suggestionItem.addEventListener('mouseleave', () => {
                    suggestionItem.classList.remove('hovered');
                });
            }
        });
        tmp = tmp.slice(0, -1);
    }
});
