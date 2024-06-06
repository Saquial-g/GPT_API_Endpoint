import express from 'express';
import dotenv from 'dotenv';

import { AiGetFunction, RespondToUser } from './AI';
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
    console.log(req.body);
    const {prompt} = req.body;
    let result = '';

    if (!prompt) {
        return res.status(400).json({
            status: false,
            error: 'No prompt was given'
        })
    }

    let func = await AiGetFunction(prompt);
    let answer = await processAIRequest(func);
    result = await RespondToUser(prompt, func, answer)

    res.json({
        "data": result
    })
})


