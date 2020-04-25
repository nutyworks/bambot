import * as discord from 'discord.js'
import {Command} from './command';
import {logger} from '../bambot'

export class PingCommand implements Command {
    readonly description: string = '응답까지 걸리는 지연 시간을 알려줍니다.';
    readonly usage: string = '밤준아 핑';
    readonly entryRegex: RegExp = /^(밤|밤준아)\s*핑/;

    execute(message: discord.Message): void {
        message.channel.send('핑: 계산 중...')
            .then(r => {
                logger.debug(`@${message.author.id} req ping, res $${r.id}`);
                r.edit(`핑: ${r.createdAt.valueOf() - message.createdAt.valueOf()}ms`)
                    .then(r => logger.debug(`Edited msg $${r.id} to ping ms`))
            })
            .catch(reason => {
                logger.info(`${reason.toString()} while writing to #${message.channel.id}`)
            });
    }

}
