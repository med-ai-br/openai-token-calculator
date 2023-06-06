import { checkbox } from "@inquirer/prompts";

type ReturnChoicesCheckbox = 'tokens' | 'encoding' | 'representation' | 'decoded' | 'graph'

export async function returnChoicesCheckbox(): Promise<ReturnChoicesCheckbox[]> {
    const responseChoices = await checkbox({
        message: 'Quais informações você deseja receber?',
        choices: [
            { name: 'Quantidade de tokens', value: 'tokens' },
            { name: 'Texto encodado', value: 'encoding' },
            { name: 'Representação', value: 'representation' },
            { name: 'Texto decodificado', value: 'decoded' },
            { name: 'Representação gráfica dos tokens', value: 'graph' },
        ],
    }) as ReturnChoicesCheckbox[];
    return responseChoices
}
