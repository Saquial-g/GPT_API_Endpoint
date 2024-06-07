
// Defines the Data Transfer Object used to communicate the chat state between functions.
export class chatDTO {
    constructor (
        public chatID: string,
        public prompt: string,
        public func: string,
        public answer: string,
        public results: string
    ){}
}