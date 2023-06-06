import { encode, decode } from 'gpt-3-encoder'
import { input } from '@inquirer/prompts';

const str: string = await input({ message: 'Digite o texto para contar tokens:' });
const encoded = encode(str)

type Representation = {
    token: number;
    string: string;
}

let representation: Representation[] = []
for(let token of encoded){
    representation.push({token, string: decode([token])})
}

const decoded = decode(encoded)

const response = {
    tokens: encoded.length,
    encoding: encoded,
    representation: representation,
    decoded: decoded,
}

console.log(response)
