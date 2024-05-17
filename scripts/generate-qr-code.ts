// Name: generate QR Code
// Description: Generates a QR code for a given text or URL 

import "@johnlindquist/kit"
import qrcode from "qrcode"

// Prompt the user for input text or URL 
const data = await arg("Enter text or URL:")

// Generate the QR code
const qrCodeImage = await qrcode.toDataURL(data, {
    quality: 1,
})

// Display the QR code in a div
await div(`
<div class="text-center flex justify-center items-center">
    <img src="${qrCodeImage}" alt="QR Code" width="300" height="100" />
</div>`)
