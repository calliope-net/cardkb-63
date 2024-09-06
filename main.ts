input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    basic.showString(text)
    basic.showNumber(text.length)
})
let zeichenCode = 0
let buffer: Buffer = null
let text = ""
text = ""
loops.everyInterval(500, function () {
    buffer = pins.pins_i2cReadBuffer(pins.pins_i2cAdressen(pins.ei2cAdressen.CardKB_x5F), 1)
    zeichenCode = pins.buffer_getUint8(buffer, 0)
    if (zeichenCode == 0) {
        basic.setLedColor(0xff0000)
    } else if (display5x5.between(zeichenCode, 32, 126)) {
        basic.setLedColor(0x00ff00)
        text = "" + text + String.fromCharCode(zeichenCode)
        basic.showString(text)
    } else {
        basic.setLedColor(0x0000ff)
        display5x5.setClearScreen()
        display5x5.zeigeBIN(zeichenCode, display5x5.ePlot.bcd, 2)
        display5x5.zeigeBIN(zeichenCode, display5x5.ePlot.hex, 4)
    }
})
