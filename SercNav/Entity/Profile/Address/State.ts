export class State {
    /**
     * Gets or Sets the state Id
     */
    public StateId: number = 0;

    /**
     * Gets or Sets the state name of the record     
     */
    public StateName: string = '';

    constructor(nStateId?: number, strStateName?: string) {
        if (nStateId)
            this.StateId = nStateId;
        if (strStateName)
            this.StateName = strStateName;
    }
}