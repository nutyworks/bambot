import * as fs from 'fs';
import * as discord from 'discord.js';
import * as winston from 'winston';
import {format, createLogger, transports} from 'winston';
import {PingCommand} from './commands/ping'
import {Command} from './commands/command';
import {HelpCommand} from "./commands/help";


export const client = new discord.Client();
export const secret = JSON.parse(fs.readFileSync('secret.json').toString());

// Initializes logger.
export const logger = createLogger({
    // Prints logs into console and .log file.
    transports: [
        new transports.Console(),
        // new transports.File({filename: `./log/${Date.now()}.log`})
    ],
    level: 'debug',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        winston.format.printf(({level, message, _, timestamp}) => {
            return `${level}${level.match(/(warn|info)/) ? "  " : " "}${timestamp}: ${message}`;
        })
    ),
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
        all: 4
    }
    // , exitOnError: false
});

winston.addColors({
    error: 'black redBG bold',
    warn: 'black yellowBG',
    info: 'blue',
    debug: 'gray'
});

// Login with token.
client.login(secret.token)
    .then(str => {
        logger.info(`Logged in with user ${client.user?.username}.`);
        logger.debug(`Token is ${str}`);
        logger.debug(`Client user id is ${client.user?.id}`);
    })
    .catch(reason => {
        logger.error(`Error occurred while logging in: ${reason}`);
    });

export const commands = [
    new PingCommand(),
    new HelpCommand()
];

/**
 * Returns command executor that matches regex.
 * @param msg
 */
function searchCommand(msg: string): Command | undefined {

    let rCommand = undefined;

    commands.forEach(command => {
        if (msg.match(command.entryRegex)) {
            rCommand = command;
        }
    });

    return rCommand;
}

client.on('ready', () => {
    client.user?.setActivity('"밤준아 도움"을 입력해봐!');
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content.match(/^(밤[^준]|밤준아)/)) {
        // Find command that matches regex
        let command = searchCommand(msg.content);

        if (command === undefined) {
            msg.reply('알 수 없는 명령입니다. 도움말을 보려면 `밤준아 도움`을 입력하세요.')
                .then(r => logger.debug(`help message sent #${r.channel.id} $${r.id}`))
                .catch(r => logger.info(`Failed to send message to #${msg.channel.id}: ${r}`));

            logger.debug(`C req @${msg.author.id} ${msg.content} not exists`);
        } else {
            command.execute(msg)
        }
    }
});
