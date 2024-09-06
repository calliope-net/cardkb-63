pins.onKeyboardEvent(function (zeichenCode, zeichenText, isASCII) {
    if (isASCII) {
        basic.setLedColor(0x00ff00)
        text = "" + text + zeichenText
        basic.showString(text)
    } else {
        basic.setLedColor(0x0000ff)
        basic.setClearScreen()
        basic.zeigeBIN(zeichenCode, basic.ePlot.bcd, 2)
        basic.zeigeBIN(zeichenCode, basic.ePlot.hex, 4)
    }
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    basic.showString(text)
    basic.showNumber(text.length)
})
let text = ""
text = ""
loops.everyInterval(500, function () {
    pins.raiseKeyboardEvent(true)
    pins.raiseKeypadEvent(true)
})
