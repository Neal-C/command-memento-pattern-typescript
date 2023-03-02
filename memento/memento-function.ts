type CommandFunction<State> = (state: State) => State;

export function createMementoStack<State>(state: State) {
	const STACK: Array<string> = [JSON.stringify(state)];

	return {
		execute(command: CommandFunction<State>) {
			const CURRENT_STATE = JSON.parse(STACK.at(-1)!);
			const NEW_STATE = command(CURRENT_STATE);

			STACK.push(JSON.stringify(NEW_STATE));
			return NEW_STATE;
		},

		undo() {
			if (STACK.length < 1) return;
			STACK.pop();
			JSON.parse(STACK.at(-1)!);
		},
	};
}

const addOne: CommandFunction<number> = (state) => {
	return state + 1;
};

const subtractOne: CommandFunction<number> = (state) => {
	return state - 1;
};

const createSetValue = (value: number) => {
	return () => value;
};

const COMMAND_STACK = createMementoStack(0); //Stack

console.log(COMMAND_STACK.execute(addOne)); //1
console.log(COMMAND_STACK.undo()); //0

console.log(COMMAND_STACK.execute(subtractOne)); //-1
console.log(COMMAND_STACK.undo()); //0

const setTo42 = createSetValue(42);

console.log(COMMAND_STACK.execute(setTo42)); //42
console.log(COMMAND_STACK.undo()); //0

//run : npx ts-node memento-function.ts
