const bip39 = require("bip39")
const niceware = require("niceware")

document.addEventListener("DOMContentLoaded", function () {

    // Element references
    const UI = document.querySelector("#key-conversion-util")
    const copy = UI.querySelector(".copy")
    const input = UI.querySelector(".input")
    const output = UI.querySelector(".output")
    const message = UI.querySelector(".message")

    // Determine whether Clipboard is supported
    const clipboardSupported = 'clipboard' in navigator

    // Copy-to-Clipboard Button
    if (clipboardSupported) {
        UI.classList.add('has-clipboard')
        copy.addEventListener("click", function () {
            navigator.clipboard.writeText(output.textContent).then(
                function () { setMsg("Copied!") },
                function () { setMsg("Unable to copy to your clipboard") }
            )
        })
    }

    // Small helper function for passing information to the user
    const setMsg = function (msg) {
        return (message.textContent = msg)
    }

    // Handle user-input
    input.addEventListener("input", function () {

        // Clear existing messages
        setMsg("")

        // Erase redundant white-space characters
        input.value = input.value.replace(/\s+/g, " ")

        // If there is no user-input, proceed no further
        if (input.value.trim().length === 0) {
            UI.classList.add("hide-output")
            return
        }

        // Check that the user has provided exactly 16 words
        const words = input.value.trim().split(" ")
        if (words.length !== 16) {
            UI.classList.add("hide-output")
            throw setMsg(`Expected 16 words. Found ${words.length}.`)
        } else {
            UI.classList.remove("hide-output")
        }

        // Get bytes from phrase
        // This will fail if a word is not in our dictionary
        let bytes = []
        try {
            bytes = niceware.passphraseToBytes(words)
        } catch (e) {
            UI.classList.add("hide-output")
            throw setMsg(e.message)
        }

        // Generate a new bip39 phrase
        const phrase = bip39.entropyToMnemonic(bytes)

        // Share the new phrase with the user
        output.textContent = phrase

        // Tell the user about our fancy click-to-copy button
        if (clipboardSupported) {
            setMsg("Click the clipboard icon to copy your new phrase.")
        } else {
            setMsg("Please select and copy your new phrase from below.")
        }

    })

})