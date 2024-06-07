import { Request, Response } from 'express';
import { v4 as uniqueID } from 'uuid';
import { handleConvHistory, AiGetFunction, RespondToUser } from './AI';
import { processAIRequest } from './local';
import { chatDTO } from './DTOs/chatDTO';

// Listen for POST requests on the specified address
// Receives the user prompt on the body of the request and processes it
export async function handlePrompt(req: Request, res: Response) {
    const {ID, prompt} = req.body;
    let chat = new chatDTO(ID, prompt, '', '', '')
    
    if (ID === undefined) {
        chat.chatID = uniqueID()
    } 

    if (!prompt) {
        return res.status(400).json({
            status: false,
            error: 'No prompt was given'
        })
    }

    try {
        chat.func = await AiGetFunction(chat);
        chat.answer = await processAIRequest(chat);
        chat.results = await RespondToUser(chat);
        console.log(chat)

        handleConvHistory(chat)

        res.json({
            "ID": chat.chatID,
            "data": chat.results
        })
    } 
    catch (e) {
        console.error(e);
        res.status(500).json({
            status: false,
            error: 'Internal server error'
        });
    }
}


