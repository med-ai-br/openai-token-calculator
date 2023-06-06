import select from '@inquirer/select';

type StringOrArchiveChoice = 'archive' | 'string'

export async function stringOrArchiveChoice(): Promise<StringOrArchiveChoice> {
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
    }) as StringOrArchiveChoice;
    if (!answer) throw new Error('Opção inválida.')
    return answer
}
