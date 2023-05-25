# ambeagle

![image](https://github.com/guizombas/ambeagle/assets/63319368/ad379be8-ec69-4b20-8695-85ab4c95be6e)

> A GitHub App built with [Probot](https://github.com/probot/probot)

> This is only a prototype

## Prerequisites

Follow https://github.com/OpenReqEU/prs-improving-requirements-quality tutorial to build and setup the requirement quality API. 

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t ambeagle .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> ambeagle
```

## Contributing

If you have suggestions for how ambeagle could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2023 guizombas
