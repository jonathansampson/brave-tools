If there are any questions regarding this document or project, please message [@BraveSampson] on Twitter.

# Background and Explanation

In 2017 [Brave] used the [Niceware library][niceware] to generate _random-yet-memorable_ passphrases (or, "recovery key") for Brave Rewards (at the time called _Brave Payments_). These phrases were 16-words long, and were generated from a wordlist containing 65,536 distinct words. Not too long afterwards, the decision to use [BIP39] was made instead.

This small repo is meant to hold a duplicate, and _more easily scrutable_ copy of the in-situ tool offered on https://brave.com/faq/#convert-old-keys. With this tool, users who happen to have one of the older Niceware-derived recovery keys can easily convert those keys into a 24-word BIP39 recovery key.

# Conversion Options

## Converter on GitHub Pages

This repository contains more than the source code for reviewing this conversion utility; it also contains the built solution, allowing you to use the utility in your browser. If you are comfortable performing the conversion here on GitHub, you can do so [here](https://jonathansampson.github.io/brave-tools/bip39-from-niceware/dist/).

If you are not comfortable performing this conversion on GitHub, please consider alternative options below.

## Run Locally via `localhost`

To perform this conversion on yoru own machine, you can clone this repository, build it locally, and run it from _localhost_. For this approach, you'll need to have [git] and [nodejs] installed, as well as know how to stand-up a localhost server. Be sure to set `/dist` as the root when you launch your localhost server.

## Run Locally via Command-Line

There is a smaller, lighter script which doesn't require localhost to run available. It's in the `n2b.js` file. This approach requires [git] and [nodejs] to run. Words from the original 16-word phrase are provided as space-seperated arguments:

```
> git clone git@github.com:jonathansampson/brave-tools.git
> cd brave-tools/bip39-from-niceware
> npm install
> node n2b 16-word-passphrase
< Your new phrase is: 24-word-passphrase
```

The last line would look something like this:

```
> node n2b wreath feint durneder worrier jenny ladrone pinochle nonelective secrete seemed overcrowding kiln refusing vaccination haploidy garnishable
< Your new phrase is: worth tuna expect light garlic stumble solar puzzle weather badge picnic bean evolve tired bunker actress iron interest kidney transfer alcohol coral funny nurse
```

The first phrase is converted into a Buffer whose bytes are then sent to BIP39 to generate the new phrase. As such, the following all represent the same value:

| Niceware (16-words) | Bytes (32) | BIP39 (24-words) |
| :------- | :---- | :---- |
| wreath feint durneder worrier jenny ladrone pinochle nonelective secrete seemed overcrowding kiln refusing vaccination haploidy garnishable | 253, 253, 77, 65, 64, 197, 253, 175, 115, 157, 119, 248, 162, 46, 144, 137, 196, 227, 197, 71, 152, 22, 118, 78, 181, 233, 243, 144, 96, 96, 87, 140 | worth tuna expect light garlic stumble solar puzzle…s iron interest kidney transfer alcohol coral funny nurse |

[git]: https://git-scm.com/downloads
[nodejs]: https://nodejs.org/
[brave]: https://brave.com/
[niceware]: https://github.com/diracdeltas/niceware
[bip39]: https://github.com/bitcoinjs/bip39
[@bravesampson]: https://www.twitter.com/bravesampson