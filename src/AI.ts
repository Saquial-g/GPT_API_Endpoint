import OpenAI from "openai";
import dotenv from 'dotenv';

// Configure the environment variables
dotenv.config();

// Specifies the rules that the LLM must follow to generate a response
// Receives an user prompt and analyses it to decide which of the specified functions to use
// Returns one of the functions allowed with the parameters specified by the LLM
export async function AiGetFunction(prompt: string) {

    // Define the rules that the model must follow
    const context = `
        You're a program which listens users and decides a function to use based on their name and what they would do.
        Answer by ONLY specifying one of the following functions with a string related to what the user asked as parameter:

        1. searchProducts(search term as string)
        2. convertCurrencies(value to convert as float, original currency in ISO4217 as String, target currency in ISO4217 as String)

        Check the user message for information that could be used in the parameters. No more detail is needed, just the adequate function for the user's request.
        If none of the functions are adequate respond by saying "none".

        User: 'I am looking for a phone'
        Assistant: 'searchProducts("Phone")'
    `

    let results = ''

    // Connect to the LLM and return the response.
    results = await ConnectToOpenAI(context, prompt)
    return results
}

export async function RespondToUser(prompt: string, func: string, answer:string){
    // Define the rules that the model must follow
    const context = `
        You're in a chat with an user. The user made you a question and you used the function ${func} to get an answer. The result of it was: ${answer}.
        Respond to the user's question in a cordial manner based on their original inquiry and the answer specified before. Make sure to keep a professional tone
        and don't explain the details. Make sure to only use the information given to you, don't add non specified information.

        Don't tell the user that you're using functions. If an error happens briefly explain that something happened without going into detail.
    `

    let results = ''

    // Connect to the LLM and return the response.
    results = await ConnectToOpenAI(context, prompt)
    return results
}

// Connect to the OpenAI Chat Completion API to get a response according to the prompt and the context
async function ConnectToOpenAI(context: string, prompt: string){
    let answer: string = ''

    try {
        const ai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const completion = await ai.chat.completions.create({
            messages:[
                {role: "system", content: context},
                {role: "user", content: prompt}
            ],
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo-0125",
        })

        console.log(completion.choices[0])
        answer = completion.choices[0].message.content || ""
    }
    catch(e){
        console.error('Error: ', e);
        return "Error: connection with the model couldn't be established"
    }

    return answer
}
