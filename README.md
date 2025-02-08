# Ten-x-engineer Bot

This is a [Cloudflare worker](https://developers.cloudflare.com/workers/) that commits to a GitHub repository every day at midnight UTC to create shiny statistics on your profile.

## Setup

1. Clone this repository
2. Install dependencies with `npm install`
3. Deploy the worker to Cloudflare with `npm run deploy`
4. Create secrets in the worker settings for the following variables:
    - `GITHUB_API_TOKEN`: A GitHub API token with access to the repository.
    - `GITHUB_REPO`: The name of the repository to commit to.
    - `GITHUB_OWNER`: The owner of the repository.

## Usage

The worker will:
- Run once per day at midnight UTC
- Make 1-10 random commits
- Each commit updates this README with a random number (0-99)
- Wait 5 seconds between commits

## Development

For local development, create a `.dev.vars` file with the required environment variables.

## Contributing

If you have any suggestions or feedback, please feel free to open an issue or submit a pull request.
