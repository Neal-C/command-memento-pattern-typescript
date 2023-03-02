abstract class Command<State>{
    abstract execute(state: State): State;
}

class MementoStack<State>{
    private stack: string[] = new Array();

    constructor(private _state: State){
        //shorthand initialiazation syntax
        this.stack.push(JSON.stringify(_state));
    };

    get state(){
        return JSON.parse(this.stack.at(-1)!);
    }

    execute(command: Command<State>){
        const stringState = JSON.stringify(command.execute(this.state));
        this.stack.push(stringState);
    }

    undo(){
        if(this.stack.length < 1) return;
        this.stack.pop();
    }

}

class AddOne extends Command<number> {
    execute(state: number): number{
        return state + 1;
    }
}

class SubstractOne extends Command<number> {
    execute(state: number): number{
        return state - 1;
    }
}

class SetValue extends Command<number> {

    constructor(private value: number){
        super();
    }

    execute(state: number): number{

        return this.value;
    };

}

const COMMAND_STACK = new MementoStack<number>(0);
console.log(COMMAND_STACK.state); // 0

COMMAND_STACK.execute(new AddOne());
console.log(COMMAND_STACK.state); // 1

COMMAND_STACK.undo();
console.log(COMMAND_STACK.state); // 0

COMMAND_STACK.execute(new SubstractOne());
console.log(COMMAND_STACK.state); // -1

COMMAND_STACK.undo();
console.log(COMMAND_STACK.state); // 0

COMMAND_STACK.execute(new SetValue(42));
console.log(COMMAND_STACK.state); // 42

COMMAND_STACK.undo();
console.log(COMMAND_STACK.state); // 0

//run : npx ts-node memento-class.ts