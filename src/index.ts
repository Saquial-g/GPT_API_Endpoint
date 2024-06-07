import express from 'express';
import dotenv from 'dotenv';
import { handlePrompt } from './router';

// Configure environment variables
dotenv.config();

// Initialize the endpoint with express
const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;
app.use(express.json());

// Route handler for POST /prompt
app.post('/prompt', handlePrompt);

// Start listening for the specified port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
