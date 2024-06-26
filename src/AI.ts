import OpenAI from "openai";
import dotenv from 'dotenv';
import { chatDTO } from './DTOs/chatDTO';

// Configure the environment variables
dotenv.config();

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type convH = {
    [userId: string]: Message[];
};

// Start small-scale conversation history memory.
// This is acceptable for a small-scale API due to the project's scope, 
// but it'd be preferable to deploy an encrypted database due to its scalability, memory and security.
const convHistory: convH = {};

// Saves the current request into the conversation history and removes the oldest request if full.
export function handleConvHistory(chat: chatDTO) {
    if (!convHistory[chat.chatID]) {
        convHistory[chat.chatID] = [];
    }

    if (convHistory[chat.chatID].length > 5){
        convHistory[chat.chatID].shift()
    }

    convHistory[chat.chatID].push({role: 'user', content: chat.prompt});
    convHistory[chat.chatID].push({role: 'assistant', content: chat.answer});
}


// Specifies the rules that the LLM must follow to generate a response
// Receives an user prompt and analyses it to decide which of the specified functions to use
// Returns one of the functions allowed with the parameters specified by the LLM
export async function AiGetFunction(chat: chatDTO) {

    // Define the rules that the model must follow, makes it so the model responds only with the related function with specified parameters
    const context = `
        You're a program which listens users and decides a function to use based on their name and what they would do.
        Answer by ONLY specifying one of the following functions with a string related to what the user asked as parameter:

        1. searchProducts(array strings of 20 1 word singular elements and synonyms of common products of the categories home or clothing or technology related to the user's inquiry without mentioning brands)
        2. convertCurrencies(value to convert as float, original currency in ISO4217 as String, target currency in ISO4217 as String)

        No more detail is needed, just the adequate function for the user's request.
        If none of the functions are adequate, respond "none".

        User: 'I am looking for a device'
        Assistant: 'searchProducts(["phone", "television", "dishwasher",...])'

        Check the conversation history if you need any parameters. For example:

        User: I'm looking for a watch
        Assistant: I found a watch for 150 USD
        User: how much is that in euros
        Assistant: convertCurrencies(150, "USD", "EUR")
    `

    let results = ''

    // Connect to the LLM and return the response.
    results = await ConnectToOpenAI(chat, context)
    console.log(results)
    return results
}

export async function RespondToUser(chat: chatDTO){

    // Define the rules that the model must follow, gives a complete professional answer based in the information given by the function. Responds normally if no information is available.
    const context = `
        You're in a chat with a customer. The user made you a question and you used the function ${chat.func} to get an answer. The result of it was ${chat.answer}.
        Respond to the user's question in a cordial manner and the answer specified before if it's not none. Make sure to keep a professional tone.
        Make sure to only use the information given to you, don't add non specified information. Keep it as a chat message,
        don't use newline or hyperlinks, you don't have to mention all the information given to you, just the relevant details. Don't make lists.
        Only mention info that you see relevant based on the user's prompt. For example, don't mention women's clothing if talking about a man.
        For products, "discount" is a binary value that represents a boolean, and mention product details.

        Don't tell the user that you're using functions. If an error happens briefly explain that something happened without going into detail.
    `

    let results = ''

    // Connect to the LLM and return the response.
    results = await ConnectToOpenAI(chat, context)
    return results
}

// Connect to the OpenAI Chat Completion API to get a response according to the prompt and the context
async function ConnectToOpenAI(chat: chatDTO, context: string){
    let answer: string = ''

    try {
        // Start a connection with the API
        const ai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Combine the conversation history with the current request
        let history = convHistory[chat.chatID] || []

        // Send the conversation data to the model to get an answer
        const completion = await ai.chat.completions.create({
            messages:[
                ...history,
                {role: "system", content: context},
                {role: "user", content: chat.prompt}
            ],
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo-0125",
        })

        answer = completion.choices[0].message.content || ""
    }
    catch(e){
        // Catches the case where the model can't be reached
        console.error('Error: ', e);
        return "Error: connection with the model couldn't be established"
    }

    return answer
}
