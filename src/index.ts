import fs from 'fs/promises'
import chalk from 'chalk';
import { input } from '@inquirer/prompts';
import { stringOrArchiveChoice } from './inputSelect.js';
import { returnChoicesCheckbox } from './inputChoices.js';
import { tokenizer } from './tokenizer.js';

function arrayContainsString(array: string[], string: string): boolean {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === string) {
            return true;
        }
    }
    return false;
}


async function main() {
    const answer = await stringOrArchiveChoice();

    let str: string
    if (answer === 'string') {
        str = await input({ message: 'Digite o texto para contar tokens:' });
    }
    if (answer === 'archive') {
        while (!str) {
            const filePath = await input({ message: 'Digite o caminho para o arquivo:' });
            try {
                str = await fs.readFile(filePath, 'utf-8');
            }
            catch (error) {
                console.error(chalk.redBright('Erro ao ler arquivo!'), chalk.yellowBright('Verifique se o caminho até o arquivo está correto e tente novamente!'));
            }
        }
    }

    let responseChoices: string[] = []
    while (responseChoices.length < 1) {
        responseChoices = await returnChoicesCheckbox();
        if (responseChoices.length < 1) console.error(chalk.redBright('Nenhuma opção selecionada!'), chalk.yellowBright('Favor selecionar pelo menos uma opção.'));
    }

    const tokenized = tokenizer(str)
    
    type Response = Partial<typeof tokenized>

    const response: Response = {}
    if (arrayContainsString(responseChoices, 'tokens')) response.tokens = tokenized.tokens;
    if (arrayContainsString(responseChoices, 'encoding')) response.encoding = tokenized.encoding;
    if (arrayContainsString(responseChoices, 'representation')) response.representation = tokenized.representation;
    if (arrayContainsString(responseChoices, 'decoded')) response.decoded = tokenized.decoded;

    console.log('')
    if (Object.keys(response).length > 0) console.log(response, '\n');


    if (arrayContainsString(responseChoices, 'graph')) {
        for (let i = 0; i < tokenized.representation.length; i++) {
            if (i % 5 === 0) process.stdout.write(chalk.bgBlue(tokenized.representation[i].string))
            if (i % 5 === 1) process.stdout.write(chalk.bgGreen(tokenized.representation[i].string))
            if (i % 5 === 2) process.stdout.write(chalk.bgYellow(tokenized.representation[i].string))
            if (i % 5 === 3) process.stdout.write(chalk.bgRed(tokenized.representation[i].string))
            if (i % 5 === 4) process.stdout.write(chalk.bgGrey(tokenized.representation[i].string))
        };
        console.log('\n');
    };
}

async function run() {
    try {
        await main()
    }
    catch (error) {
        console.error(error.message)
    }  
}

run();
