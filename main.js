import { encode, decode } from 'gpt-3-encoder'

const str = "Testando essa desgraça."
const encoded = encode(str)

let representation = []
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