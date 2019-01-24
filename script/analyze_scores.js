#!/usr/local/bin/node

const fs = require('fs');
const path = require('path');
const bot = require("circle-github-bot").create();


const pkg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const requiredScores = pkg.lighthouse.requiredScores;

const actualScores = [];

fs.readdirSync(process.argv[3]).forEach(file => {
  if (path.extname(file) === '.json') {
    actualScores.push(JSON.parse(fs.readFileSync(path.resolve(process.argv[3], file), 'utf8')));
  }
})


let success = true;

const scoresAcrossRunsByCategory = actualScores.reduce((acc, run) => {
  Object.keys(requiredScores).forEach(category => {
    acc[category] = acc[category] || [];
    acc[category].push(run.categories[category].score * 100);
  });
  return acc;
}, {});

console.log('------------------------------------------');
console.log(`Number of parallel test runs: ${actualScores.length}`);
console.log('------------------------------------------');

Object.keys(requiredScores).forEach(category => {
  const requiredOutOf100 = requiredScores[category];
  const actualBestOutOf100 = Math.max.apply(null, scoresAcrossRunsByCategory[category]);

  if (actualBestOutOf100 < requiredScores[category]) {
    console.log(`❌ ${category}: ${actualBestOutOf100}/${requiredOutOf100}`);
    success = false;
  } else {
    console.log(`✅ ${category}: ${actualBestOutOf100}/${requiredOutOf100}`);
  }

  const areAllScoresEqual = scoresAcrossRunsByCategory[category]
    .every((val, i, arr) => val === scoresAcrossRunsByCategory[category][0]);

  if (!areAllScoresEqual) {
    console.log(`   - scores varied across runs: [${scoresAcrossRunsByCategory[category].join(' ')}]`)
  }
});

bot.comment(process.env.GITHUB_OAUTH_TOKEN, '<p>what up this is an automated message</p>');

if (!success) {
  process.exit(1);
}
