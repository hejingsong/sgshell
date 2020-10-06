export enum TerminalState {
    LOADING = 1,
    SUCCESS,
    TIP,
    FAILURE
}

export const StateIcon = {
    [TerminalState.LOADING]: "./img/load.png",
    [TerminalState.SUCCESS]: "./img/true.png",
    [TerminalState.TIP]: "./img/warning.png",
    [TerminalState.FAILURE]: "./img/false.png"
};
