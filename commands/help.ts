import * as discord from 'discord.js'
import * as winston from 'winston'
import {Command} from './command';
import {commands, logger} from '../bambot'

export class HelpCommand implements Command {
    readonly description: string = '도움말을 보여줍니다.';
    readonly usage: string = '밤준아 도움';
    readonly entryRegex: RegExp = /^(밤|밤준아)\s*도움/;

    private static readonly maxLength = 6;

    execute(message: discord.Message): void {
        let helpText = '```css\n';

        // Sort and make help text.
        commands.sort((a, b) => a.usage.localeCompare(b.usage)).forEach(c => {
            helpText += `[${c.usage}]${'　'.repeat(HelpCommand.maxLength - c.usage.length)}\t${c.description}\n`
        });

        helpText += '```';

        // Try to send help to DM.
        message.author.send(helpText)
            .then(r => {
                // When success to send DM.
                logger.debug(`@${message.author.id} req help, res dm $${r.id}`);

                if (message.channel.type !== 'dm')
                    message.channel.send('도움말을 DM으로 전송했습니다.')
                        .then(r => logger.debug(`@${message.author.id} req help, res $${r.id}`))
                        // When failed to message at channel: Permission denied.
                        .catch(r => logger.info(`@${message.author.id} req help, fail couldn't info: ${r}`))
            })
            .catch(r => {
                // When failed to send DM; disabled by user.
                logger.debug(`@${message.author.id} req help, rej: ${r}`);
                message.channel.send('도움말을 전송하지 못했습니다. DM 설정을 확인해주세요.')
                    .then(r => logger.debug(`@${message.author.id} req help, info couldn't send help: ${r}`))
                    // When failed to send information at channel: Permission denied.
                    .catch(r => logger.info(`@${message.author.id} req help, failed to help at anywhere: ${r}`))
            })
    }
}
