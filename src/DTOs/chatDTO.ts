
export class chatDTO {
    constructor (
        public chatID: string,
        public prompt: string,
        public func: string,
        public answer: string,
        public results: string
    ){}
}