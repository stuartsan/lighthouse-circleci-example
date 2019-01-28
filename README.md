For more detail check out the [blog post](https://stuartsandine.com/lighthouse-circle-ci).

## Overview

This project demonstrates integrating [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
into a CI/CD pipeline with [CircleCI](https://circleci.com) so that for every pull request to this repo:

- A demo single-page app, bootstrapped with [Create React App](https://github.com/facebook/create-react-app), is built and deployed to its staging environment in AWS Cloudfront using [amplify](https://aws-amplify.github.io/)
- Within a docker container, Lighthouse drives Chrome (headlessly) to test the performance (and accessibility, seo, etc) of multiple pages of the staging deployment:
  - `/`: the home page is tested as an unauthenticated user
  - `/dashboard`: the dashboard page is tested as an authenticated user. We use [puppeteer](https://github.com/GoogleChrome/puppeteer) to log in
  - For each page, we do more than one Lighthouse run concurrently, so that we can extract a best score or median (or whatever) across runs (some performance metrics tend to vary across runs)
  - Tests against the different pages are also run concurrently
  - In addition to the out-of-the-box audits performed by Lighthouse, we run a custom performance audit against the size of our main JS bundle
- We analyze the reports from all the Lighthouse runs and compare scores against predefined performance budgets. 
- If we fail to meet any of the performance budgets, the PR status check is set to "failing" and we can optionally prevent the PR from being merged
- We send a comment to the PR, which lists our actual scores against the performance budgets and provides links to the detailed Lighthouse html report for each run

## The most relevant things to look at

- `package.json`: the `lighthouse` section defines our performance budgets for this project.
- `.circleci/config.yml`: the CircleCI configuration file that wires everything together from the top down.
- `ci-scripts/analyze_scores.js`: script that takes 1 or more Lighthouse reports, and a package.json containing performance budget definitions, and decides if we passed or failed, and then updates the PR with a comment.
- `lighthouse-config/`: custom configuration files we pass into the Lighthouse CLI to set up a custom audit for bundle size, and to log in a user with puppeteer
