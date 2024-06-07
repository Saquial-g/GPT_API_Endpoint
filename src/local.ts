import dotenv from 'dotenv';
import { Prod, getDatabase } from './DatabaseManager';
import { chatDTO } from './DTOs/chatDTO';

// Configure the environment variables
dotenv.config();

// Evaluate the function specified by the model and execute it if it exists.
export async function processAIRequest(chat: chatDTO){
    let answer = ''
    try{
        answer = await eval(chat.func);
    }
    catch(e){
        answer = "none"
    }
    
    return answer
}

// Use the Open Exchange Rates API to retrieve the current currency values and make the conversion according to the specified parameters.
async function convertCurrencies(val: number, orgCurr: string, targCurr: string){
    const fetch = require('node-fetch')
    let answer = ''
    
    try{
        // Get the current currency values from Open Exchange Rates.
        const response = await fetch('https://openexchangerates.org/api/latest.json?app_id=' + process.env.OER_API_KEY)
        let data = await response.json();

        // Make sure that the currencies specified by the parameters are valid and convert.
        if (data.rates[orgCurr] === undefined){
            answer = "Error: The specified currency (" +  orgCurr +  ") isn't valid"
        } else if (data.rates[targCurr] === undefined){
            answer = "Error: The specified currency (" +  targCurr +  ") isn't valid"
        } else {
            let convVal = val / Number(data.rates[orgCurr]) * Number(data.rates[targCurr])
            answer = String(convVal)
        }
    } 
    catch(e) {
        console.log(e);
        answer = "Error: Currency information couldn't be retrieved"
    } 

    return answer
}

// Search in the previosuly initialized product database for a product that fits the specified parameter
async function searchProducts(searchParameters: string[]) {
    let possible:Prod[] = []

    let db = await getDatabase()

    searchParameters.forEach((elem) => {
        let results = db.filter(Prod => Prod.embeddingText.toLocaleLowerCase().includes(elem))
        if (results.length > 0){
            possible = possible.concat(results)
        }
    })

    possible = possible.sort(() => Math.random() - 0.5); 

    try{
        return String([JSON.stringify(possible[0]), JSON.stringify(possible[1])])
    }
    catch(e){
        return "Error: no results"
    }
}
    