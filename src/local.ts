import { json } from 'body-parser';
import dotenv from 'dotenv';

// Configure the environment variables
dotenv.config();



// Evaluate the function specified by the model and execute it if it exists.
export async function processAIRequest(func: string){
    let answer = ''
    try{
        answer = await eval(func);
    }
    catch(e){
        console.error('Error: ', e);
        answer = "Error: unable to help"
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
function searchProducts(searchParameter: string) {
    
}
    