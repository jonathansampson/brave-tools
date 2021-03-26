If there are any questions regarding this document or utility, please message [@BraveSampson] on Twitter.

# Background and Explanation

Earlier versions of Brave Rewards used a 16-word ([Niceware]) recovery key. Modern versions of Brave use a 24-word ([BIP39]) recovery key. If you would like to restore a wallet which was created with an earlier recovery key, you will first need to convert your 16-word recovery key into a 24-word recovery key. This document and utility exists to assist you in making this conversion.

Additionally, this respository exists for those who would like to scrutinize the utility more closely (after all, recovery keys are involved), and/or run the utility on their own machine, performing the conversion locally. Various options exist below, but please do not hesitate to contact [@BraveSampson] should you have any questions or comments.

# Conversion Options

## Converter on GitHub Pages

The easiest way to perform this conversion is here on GitHub, via the [utility page]. This approach requires you to paste your 16-word recovery key into github.com, which may make some users uncomfortable. This page is not designed to perform any network activity; no calls should be made to retrieve a word-list, or any other logic to perform the conversion. As such, you should not expect to see your browser making requests or transmitting any of the _recovery key data_ anywhere.

If you would like to see _exactly_ what this conversion utility does, you can inspect the source in [src/index.js](src/index.js).

For those who would rather clone, build, and run this utility locally, other options exist.

## Run Locally via Command-Line

Provided with this repo is a small command-line script (n2b.js) which will also perform the conversion. This approach requires the user to have [git], [nodejs], and [npm] installed on their machine.

Command-line usage looks like the following:

```
> node n2b wreath feint durneder worrier jenny ladrone pinochle nonelective secrete seemed overcrowding kiln refusing vaccination haploidy garnishable
< Your new phrase is: worth tuna expect light garlic stumble solar puzzle weather badge picnic bean evolve tired bunker actress iron interest kidney transfer alcohol coral funny nurse
```

The first phrase is converted into a Buffer whose bytes are then sent to a BIP39 method to generate the new phrase. As such, all of the following represent the same value:

| Niceware (16-words) | Bytes (32) | BIP39 (24-words) |
| :------- | :---- | :---- |
| wreath feint durneder worrier jenny ladrone pinochle nonelective secrete seemed overcrowding kiln refusing vaccination haploidy garnishable | 253, 253, 77, 65, 64, 197, 253, 175, 115, 157, 119, 248, 162, 46, 144, 137, 196, 227, 197, 71, 152, 22, 118, 78, 181, 233, 243, 144, 96, 96, 87, 140 | worth tuna expect light garlic stumble solar puzzle…s iron interest kidney transfer alcohol coral funny nurse |

## Run Locally via `localhost`

If you have already cloned and built the solution, you can stand-up a localhost from the `/dist` directory. Accessing it will present the same conversion utility shown in the first option above, using GitHub Pages.

[git]: https://git-scm.com/downloads
[nodejs]: https://nodejs.org/
[npm]: https://npmjs.com/
[brave]: https://brave.com/
[niceware]: https://github.com/diracdeltas/niceware
[bip39]: https://github.com/bitcoinjs/bip39
[@bravesampson]: https://www.twitter.com/bravesampson
[utility page]: https://jonathansampson.github.io/brave-tools/bip39-from-niceware/dist/
