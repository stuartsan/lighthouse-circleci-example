#!/usr/local/bin/node

const fs = require("fs");
const path = require("path");
const bot = require("circle-github-bot").create();

const pkg = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const requiredScores = pkg.lighthouse.requiredScores;

const reportsDir = process.argv[3];

const reports = {
  anonymous: {
    json: [],
    htmlFilenames: [],
  },
  authenticated: {
    json: [],
    htmlFilenames: [],
  }
};

fs.readdirSync(reportsDir).forEach(file => {
  const userType = file.split('-')[0];

  if (path.extname(file) === ".json") {
    reports[userType].json.push(
      JSON.parse(fs.readFileSync(path.resolve(reportsDir, file), "utf8"))
    );
  } else if (path.extname(file) === ".html") {
    reports[userType].htmlFilenames.push(file);
  }
});

let success = true;

const ciStdout = [];
const prComment = [];

['anonymous', 'authenticated'].forEach(userType => {

  const scoresAcrossRunsByCategory = reports[userType].json.reduce((acc, run) => {
    Object.keys(requiredScores).forEach(category => {
      acc[category] = acc[category] || [];
      acc[category].push(run.categories[category].score * 100);
    });
    return acc;
  }, {});

  ciStdout.push(
    "------------------------------------------",
    `Number of parallel test runs (${userType}): ${reports[userType].json.length}`,
    "------------------------------------------"
  );

  prComment.push(
    `<h2>Lighthouse scores (${userType})</h2>`,
    `<p>Best scores across <strong>${reports[userType].json.length}</strong> parallel runs:</p>`,
    '<p>'
  );

  Object.keys(requiredScores).forEach(category => {
    const requiredOutOf100 = requiredScores[category];
    const actualBestOutOf100 = Math.max.apply(
      null,
      scoresAcrossRunsByCategory[category]
    );

    if (actualBestOutOf100 < requiredScores[category]) {
      ciStdout.push(`❌ ${category}: ${actualBestOutOf100}/${requiredOutOf100}`);
      prComment.push(
        `<strong>❌ ${category}:</strong> ${actualBestOutOf100}/${requiredOutOf100}<br />`
      );
      success = false;
    } else {
      ciStdout.push(`✅ ${category}: ${actualBestOutOf100}/${requiredOutOf100}`);
      prComment.push(
        `<strong>✅ ${category}:</strong> ${actualBestOutOf100}/${requiredOutOf100}<br />`
      );
    }
  });

  prComment.push(
    '</p>'
  );

  const reportLinks = reports[userType].htmlFilenames.map((filename, idx) => {
    let link = bot.artifactLink(`reports/${filename}`, `run ${idx + 1}`);
    // LMAO -- this bot is making some assumptions about file path
    // that I can't easily override so w/e
    return link.replace("/home/circleci/project", "");
  });
  prComment.push(`<p><strong>Detailed reports</strong>: ${reportLinks.join(", ")}</p>`);
});


console.log(ciStdout.join("\n"));

// We shouldn't fail if the PR comment doesn't work, that is a "nice to have"
try {
  bot.comment(process.env.GITHUB_OAUTH_TOKEN, prComment.join("\n"));
} catch (e) {
  console.log(e);
}

if (!success) {
  process.exit(1);
}
