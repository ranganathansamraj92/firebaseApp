export class Greetings{

    userName:string;

    constructor( ...names: string[]){
        this.userName = names.join(", ") +" ..!!";
    }

    greet = () => {
        return `Hello ${this.userName}`;
    }
    
}