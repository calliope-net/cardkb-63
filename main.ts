input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
	
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    basic.showString(CardKB.readLetter(characterFormat.ascii))
})
let code = 0
let buffer: Buffer = null
let i2cAdresse = pins.pins_i2cAdressen(pins.ei2cAdressen.CardKB_x5F)
loops.everyInterval(500, function () {
    buffer = pins.pins_i2cReadBuffer(i2cAdresse, 1)
    code = pins.buffer_getUint8(buffer, 0)
    if (display5x5.between(code, 32, 126)) {
        basic.showString(String.fromCharCode(code))
    } else {
        display5x5.setClearScreen()
        display5x5.zeigeBIN(code, display5x5.ePlot.bcd, 2)
        display5x5.zeigeBIN(code, display5x5.ePlot.hex, 4)
    }
})
