input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    buffer = pins.pins_i2cReadBuffer(i2cAdresse, 1)
    basic.showNumber(pins.buffer_getUint8(buffer, 0))
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    basic.showString(CardKB.readLetter(characterFormat.ascii))
})
let buffer: Buffer = null
let i2cAdresse = 0
i2cAdresse = pins.pins_i2cAdressen(pins.ei2cAdressen.CardKB_x5F)
