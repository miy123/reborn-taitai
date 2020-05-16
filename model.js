class Command {
    constructor(commandString, action, param) {
        this.commandString = commandString;
        this.action = action;
        this.param = param;
    }
}

module.exports = Command;