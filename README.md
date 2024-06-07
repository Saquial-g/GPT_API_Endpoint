
 # GPT API Endpoint

This is a technical test for an API endpoint which allows the user to chat with a supervised version of a Model which can be fed specific information from local functions according to the user's requirements.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install and set up this project locally, follow these steps:

1. Clone the repository and open the folder: On Git Bash

	git clone https://github.com/Saquial-g/GPT_API_Endpoint.git
    	cd GPT_API_Endpoint

2. Install dependencies: On Git Bash
    	
	npm install

3. Set up environment variables: Create a `.env` file in the root directory of your project and add the necessary environment variables. You can use the `.env.example` file as a template.

    	PORT= port
    	OPENAI_API_KEY= OpenAIChatCompletionAPIkey
	OPENAI_MODEL= ModelToUse
	OER_API_KEY= OpenExchangeRatesAPIkey
	
    
## Usage

To start the server, run the following command:

npx ts-node src/index.ts

The server will start running at http://localhost:PORT/, as specified in the .env file. Port 3000 will be used if PORT can't be retrieved.

### API Endpoints

#### POST /prompt

This endpoint processes user prompts and interacts with the GPT model.

- URL: /prompt
- Method: POST
- Parameters:
    - ID (optional): The chat session ID. Allows the chat to keep a history of the conversation
    - prompt (required): The user prompt to be processed.

- Response:
    - ID: The chat session ID.
    - data: The response from the GPT model.

## Configuration

### Environment Variables

The application uses the following environment variables:

- PORT: the port that the API should use, 3000 by default
- OPENAI_API_KEY: Your OpenAI Chat Completion API key
- OPENAI_MODEL: The GPT model to use, gpt-3.5-turbo-0125 by default
- OER_API_KEY: Your Open Exchange Rates API key

## Contributing

This was made as a technical test, but feel free to contribute as you wish:

1. Fork the repository.
2. Create a new branch for your feature or bugfix: git checkout -b feature-name
3. Make your changes and commit them: git commit -m "Description of your changes"
4. Push your changes to your fork: git push origin feature-name
5. Open a pull request on the main repository.

## License

This project is licensed under the MIT License.

