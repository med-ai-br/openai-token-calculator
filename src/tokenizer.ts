import { encode, decode } from 'gpt-3-encoder'

type Representation = {
    token: number;
    string: string;
}

type Tokenizer = {
    tokens: number;
    encoding: number[];
    representation: Representation[];
    decoded: string;
}

export function tokenizer(data: string): Tokenizer {
    const encoded = encode(data)
    const decoded = decode(encoded)

    let representation: Representation[] = []
    for (let i = 0; i < encoded.length; i++) {
        const token = encoded[i]
        const tokenString = decode([token])
        representation.push({ token: token, string: tokenString })
    }

    return {
        tokens: encoded.length,
        encoding: encoded,
        representation: representation,
        decoded: decoded,
    }
}
