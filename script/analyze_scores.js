#!/usr/local/bin/node

const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const requiredScores = pkg.lighthouse.requiredScores;
const actualScores = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

let success = true;

Object.keys(requiredScores).forEach(requirement => {
  const requiredOutOf100 = requiredScores[requirement];
  const actualOutOf100 = actualScores.categories[requirement].score * 100;

  if (actualOutOf100 < requiredScores[requirement]) {
    console.log(`❌Failure: required score for ${requirement} is ${requiredOutOf100}, got ${actualOutOf100}`);
    success = false;
  } else {
    console.log(`✅Target score for ${requirement} is ${requiredOutOf100}, got ${actualOutOf100}`);
  }
});

if (!success) {
  process.exit(1);
}
