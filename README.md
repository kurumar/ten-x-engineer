[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub stars](https://img.shields.io/github/stars/kurumar/ten-x-engineer-worker)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![GitHub last commit](https://img.shields.io/github/last-commit/kurumar/ten-x-engineer-worker)
![GitHub issues](https://img.shields.io/github/issues/kurumar/ten-x-engineer-worker)
![GitHub pull requests](https://img.shields.io/github/issues-pr/kurumar/ten-x-engineer-worker)

# Ten-x-engineer worker

This is a [Cloudflare worker](https://developers.cloudflare.com/workers/) that commits to a GitHub repository every day at midnight UTC to create shiny statistics on your GitHub profile.

## Setup

1. Clone this repository
2. Install dependencies with `npm install`
3. Deploy the worker to Cloudflare with `npm run deploy`
4. Create secrets in the Cloudflare worker dashboard for the following variables:
    - `GITHUB_API_TOKEN`: A GitHub API token with access to the repository.
    - `GITHUB_REPO`: The name of the repository to commit to.
    - `GITHUB_OWNER`: The owner of the repository.

## Usage

Ten-x-engineer worker:
- Runs once per day at midnight UTC
- Makes (1-10) random commits
- Each commit updates README.md file with a random number (0-99)

## Example

Repository example: [kurumar/ten-x-repository](https://github.com/kurumar/ten-x-repository)

## Contributing

If you have any suggestions or feedback, please feel free to open an issue or submit a pull request.