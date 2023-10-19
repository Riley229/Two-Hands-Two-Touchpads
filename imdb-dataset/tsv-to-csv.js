const fs = require('fs');
const readline = require('readline');

const inputFile = './title.basics.tsv';
const outputFile = './imdb.titles.csv';
const acceptedTypes = ['movie', 'tvSeries'];

// process input file
void (async () => {
  // create interface for reading input file
  const rl = readline.createInterface({
    input: fs.createReadStream(inputFile),
    crlfDelay: Infinity,
  });

  // write the title line first
  fs.appendFileSync(outputFile, 'type,title');

  // iterate line by line
  rl.on('line', (entry) => {
    const data = entry.split('\t');
    var type = data[1];
    var year = data[5];
    var title = data[2];
    if (title.includes(','))
      title = `"${title}"`;

    if (acceptedTypes.includes(type) && title.length > 1 && parseInt(year) > 1950)
      fs.appendFileSync(outputFile, `\n${type.substring(0, 1)},${title}`);
  });
})();