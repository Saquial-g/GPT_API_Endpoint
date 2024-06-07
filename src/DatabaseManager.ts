import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

// Initialize a local database from the given csv file

// Define the structure of the database
export type Prod = {
    displayTitle: String,
    embeddingText: String,
    url: String,
    imageUrl: String,
    productType: String,
    discount: Number,
    price: String,
    variants: String,
    createDate: String
};

export async function getDatabase() {
    const fileLocation = path.resolve(__dirname, '..', 'data', 'products_list.csv');
    const headers = ['displayTitle', 'embeddingText', 'url', 'imageUrl', 'productType', 'discount', 'price', 'variants', 'createDate'];
    const content = fs.readFileSync(fileLocation, {encoding: 'utf-8'});

    const db: Prod[] = await new Promise((resolve, reject) => {
        parse(content, {
            delimiter: ',',
            columns: headers,
        }, (error, result: Prod[]) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });

    return db
}

export async function searchDatabase() {

}
    

