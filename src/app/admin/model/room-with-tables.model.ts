import { Table } from "./table.model";

export class RoomWithTables {
    constructor(public id : number, public name : string, public tables : Table[], 
        public rows : number, public columns : number) {
    }
}