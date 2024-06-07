import express from 'express';
import dotenv from 'dotenv';
import { v4 as uniqueID } from 'uuid';

import { handleConvHistory, AiGetFunction, RespondToUser} from './AI';
import { processAIRequest } from './local';

// Configure environment variables
dotenv.config();

// Initialize the endpoint with express
const router: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;
router.use(express.json());

// Start listening for the specified port
router.listen(port, (): void => {
    console.log(`server http://localhost:${port}/`);
})

// Listen for POST requests on the specified address
// Receives the user prompt on the body of the request and processes it
router.post('/prompt', async (req, res) => {
    const {ID, prompt} = req.body;
    let chatID = ID

    if (ID === undefined) {
        chatID = uniqueID()
    }
    console.log(chatID)

    if (!prompt) {
        return res.status(400).json({
            status: false,
            error: 'No prompt was given'
        })
    }

    try {
        let func = await AiGetFunction(chatID, prompt);
        let answer = await processAIRequest(func);
        let result = await RespondToUser(chatID, prompt, func, answer)

        handleConvHistory( chatID, prompt, result)

        res.json({
            "ID": chatID,
            "data": result
        })
    } 
    catch (e) {
        console.error(e);
        res.status(500).json({
            status: false,
            error: 'Internal server error'
        });
    }
})


