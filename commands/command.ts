import * as discord from 'discord.js'
import * as winston from 'winston'

export interface Command {
    readonly usage: string;
    readonly description: string;
    readonly entryRegex: RegExp;

    /**
     * Runs the command.
     * @param message Command received from user.
     */
    execute(message: discord.Message): void;
}