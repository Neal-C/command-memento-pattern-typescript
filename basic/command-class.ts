abstract class Command<State>{
    abstract execute(state: State): State;
    abstract undo(state: State): State;
}

class CommandStack<State>{
    private stack: Command<State>[] = new Array();

    constructor(private _state: State){
        //shorthand initialiazation syntax
    };

    get state(){
        return this._state;
    }

    execute(command: Command<State>){
        this._state = command.execute(this._state);
        this.stack.push(command);
    }

    undo(){
        let command = this.stack.pop();
        if(!command) return;
        this._state = command.undo(this._state);
    }
}

class AddOne extends Command<number> {
    execute(state: number): number{
        return state + 1;
    }

    undo(state: number): number {
        return state - 1;
    }
}

class SubstractOne extends Command<number> {
    execute(state: number): number{
        return state - 1;
    }

    undo(state: number): number {
        return state + 1;
    }
}

class SetValue extends Command<number> {

    private _originalValue?:  number;

    constructor(private value: number){
        super();
    }

    execute(state: number): number{
        //state is received from the command stack;
        this._originalValue = state;
        return this.value;
    };

    undo(state: number): number {
        return this._originalValue!;
    }
}

const COMMAND_STACK = new CommandStack<number>(0);
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

//run : npx ts-node command-class.ts

