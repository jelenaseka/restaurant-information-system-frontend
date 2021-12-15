// export interface SocketResponse {
//     successfullyFinished : boolean,
//     message: string,
// }
export class SocketResponse {
    constructor(public message : string, public successfullyFinished : boolean, public code: string) {}
}