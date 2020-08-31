// Loads necessary libraries
const b = require('bip39')
const n = require('niceware')

// Pulls in the user's passphrase
// › node n2b <16-word passphrase>
const [node, script, ...p] = process.argv

// Input must contain exactly 16 words
if (p.length !== 16)
    return console.log('Error: Please provide 16 words')

// Generates a new BIP39 passphrase
const bip39 = b.entropyToMnemonic( n.passphraseToBytes(p) )

// And shares it in the output
// ‹ <24-word passphrase>
console.log(`Your new phrase is: ${bip39}`)
