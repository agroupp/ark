export type UpdateStateFunction<State, UpdatedState extends Partial<State>> = (state: State) => UpdatedState;
