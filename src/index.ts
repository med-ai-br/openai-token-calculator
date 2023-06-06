import fs from 'fs/promises'
import { encode, decode } from 'gpt-3-encoder'
import chalk from 'chalk';
import { input } from '@inquirer/prompts';
import select from '@inquirer/select';
import checkbox from '@inquirer/checkbox';

function arrayContainsString(array: string[], string: string): boolean {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === string) {
            return true;
        }
    }
    return false;
}


async function main() {
    const answer = await select({
        message: 'Escolha a opção desejada:',
        choices: [
            {
                name: 'Contar tokens de um arquivo de texto',
                value: 'archive',
                description: 'Informe o local do arquivo e receba a contagem de tokens',
            },
            {
                name: 'Contar tokens digitando o texto no terminal',
                value: 'string',
                description: 'Digite o texto no terminal e receba a contagem de tokens',
            },
        ],
    });
    if (!answer) throw new Error('Opção inválida.')


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
        responseChoices = await checkbox({
            message: 'Quais informações você deseja receber?',
            choices: [
                { name: 'Quantidade de tokens', value: 'tokens' },
                { name: 'Texto encodado', value: 'encoding' },
                { name: 'Representação', value: 'representation' },
                { name: 'Texto decodificado', value: 'decoded' },
                { name: 'Representação gráfica dos tokens', value: 'graph' },
            ],
        });
        if (responseChoices.length < 1) console.error(chalk.redBright('Nenhuma opção selecionada!'), chalk.yellowBright('Favor selecionar pelo menos uma opção.'));
    }


    const encoded = encode(str)

    type Representation = {
        token: number;
        string: string;
    }

    let representation: Representation[] = []
    for (let i = 0; i < encoded.length; i++) {
        const token = encoded[i]
        const tokenString = decode([token])
        representation.push({ token: token, string: tokenString })
    }

    const decoded = decode(encoded)


    type Response = {
        tokens?: number;
        encoding?: number[];
        representation?: Representation[];
        decoded?: string;
    }

    const response: Response = {}
    if (arrayContainsString(responseChoices, 'tokens')) response.tokens = encoded.length;
    if (arrayContainsString(responseChoices, 'encoding')) response.encoding = encoded;
    if (arrayContainsString(responseChoices, 'representation')) response.representation = representation;
    if (arrayContainsString(responseChoices, 'decoded')) response.decoded = decoded;

    console.log('')
    if (Object.keys(response).length > 0) console.log(response, '\n');


    if (arrayContainsString(responseChoices, 'graph')) {
        for (let i = 0; i < representation.length; i++) {
            if (i % 5 === 0) process.stdout.write(chalk.bgBlue(representation[i].string))
            if (i % 5 === 1) process.stdout.write(chalk.bgGreen(representation[i].string))
            if (i % 5 === 2) process.stdout.write(chalk.bgYellow(representation[i].string))
            if (i % 5 === 3) process.stdout.write(chalk.bgRed(representation[i].string))
            if (i % 5 === 4) process.stdout.write(chalk.bgGrey(representation[i].string))
        };
        console.log('\n');
    };
}

try {
    await main()
}
catch (error) {
    console.error(error.message)
}
