type CommandFunction<State> = (state: State) => [State, (state: State) => State];

export function createCommandStack<State>(state: State) {
	const stack: Array<(state: State) => State> = new Array();
	let _state = state;

	return {
		execute(command: CommandFunction<State>) {
			const [newState, undoFn] = command(_state);
			_state = newState;
			stack.push(undoFn);
			return _state;
		},

		undo() {
			let undoFn = stack.pop();
			if (!undoFn) return;
			_state = undoFn(_state);
            return _state;
		},
	};
}

const addOne: CommandFunction<number> = (state) => {
	return [state + 1, (state) => state - 1];
};

const subtractOne: CommandFunction<number> = (state) => {
	return [state - 1, (state) => state + 1];
};

const createSetValue = (value:number) : CommandFunction<number> => {
    return (state) => {
        const _originalValue = state;
        return [value, () => _originalValue];
    }
}

const COMMAND_STACK = createCommandStack(0); //Stack

console.log(COMMAND_STACK.execute(addOne)); //1
console.log(COMMAND_STACK.undo()); //0

console.log(COMMAND_STACK.execute(subtractOne)); //-1
console.log(COMMAND_STACK.undo()); //0

const setTo42 = createSetValue(42);

console.log(COMMAND_STACK.execute(setTo42)); //42
console.log(COMMAND_STACK.undo()); //0

//run : npx ts-node command-function.ts



