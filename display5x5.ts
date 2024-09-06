
namespace basic {

    // ========== group="25 LED Display" advanced=true color=#54C9C9

  //  let n5x5_setClearScreen = true // wenn ein Image angezeigt wird, merken dass z.B. Funkgruppe wieder angezeigt werden muss

    //% group="BIN" subcategory="25 LED Display"
    //% block="lösche 25 LED Display" weight=9
    export function setClearScreen() {
       // n5x5_setClearScreen = true
        a5x5_xBuffer.fill(0xFF) // mit ungültigen Werten füllen, die rekursiv wieder zu 0 werden
        for (let x = 4; x >= 0; x--) {
            zeigeBIN(0, ePlot.bin, x)
        }
    }

    //let n5x5_x01y0 = 0 // Bit 5-4 Betriebsart in x=0-1 y=0
    let a5x5_x01y0 = [false, false]
    let a5x5_xBuffer = Buffer.create(5)

    // ↕↕...
  
    //% group="BIN" subcategory="25 LED Display"
    //% block="zeige ↑↑... x0 %x0y0 x1 %x1y0" weight=8
    //% x0y0.shadow=toggleOnOff
    //% x1y0.shadow=toggleOnOff
    export function zeige5x5Betriebsart(x0y0: boolean, x1y0: boolean) {
        if (a5x5_x01y0[0] !== x0y0 || a5x5_x01y0[1] !== x1y0) {
            a5x5_x01y0[0] = x0y0
            a5x5_x01y0[1] = x1y0

            if (a5x5_x01y0[0]) { led.plot(0, 0) } else { led.unplot(0, 0) }
            if (a5x5_x01y0[1]) { led.plot(1, 0) } else { led.unplot(1, 0) }
        }
    }

    // zeigt Funkgruppe oder i²C Adresse im 5x5 Display binär an

    export enum ePlot {
        //% block="BIN 0..31"
        bin,
        //% block="HEX Zahl"
        hex,
        //% block="BCD Zahl"
        bcd,
        //% block="BIN 0..255"
        map
    }

    //% group="BIN" subcategory="25 LED Display"
    //% block="zeige ↕↕↕↕↕ %int %format ←x %xLed" weight=3
    //% xLed.min=0 xLed.max=4 xLed.defl=4
    export function zeigeBIN(int: number, format: ePlot, xLed: number) {
        int = Math.imul(int, 1) // 32 bit signed integer
        xLed = Math.imul(xLed, 1) // entfernt mögliche Kommastellen

        if (format == ePlot.bin && between(xLed, 0, 4)) {

            // pro Ziffer werden mit zeigeBIN immer 5 LEDs geschaltet 0..31
           /*  if (n5x5_setClearScreen) {  // wenn vorher Image oder Text angezeigt wurde
                n5x5_setClearScreen = false
                a5x5_xBuffer.fill(0xFF) // mit ungültigen Werten füllen, die rekursiv wieder zu 0 werden
                for (let x = 4; x >= 0; x--) {
                    zeigeBIN(0, ePlot.bin, x)
                }
                // basic.clearScreen()     // löschen und Funkgruppe in 01 ↕↕... wieder anzeigen
                //zeigeFunkgruppe()       // !ruft zeigeBIN rekursiv auf!
                //a5x5_x01y0 = [false, false] // n5x5_x01y0 = 0 // Betriebsart auch neu anzeigen nach clearScreen
            } */
            // nur bei Änderung
            if (a5x5_xBuffer[xLed] != int) {
                a5x5_xBuffer[xLed] = int

                for (let y = 4; y >= 0; y--) {
                    if ((int % 2) == 1) { led.plot(xLed, y) } else { led.unplot(xLed, y) }
                    int = int >> 1 // bitweise Division durch 2
                }
            }
        }
        else if (format == ePlot.map) {
            if (int == 0)
                zeigeBIN(0, ePlot.bin, xLed)
            else
                zeigeBIN(mapInt32(int, 1, 255, 1, 31), ePlot.bin, xLed) // 8 Bit auf 5 Bit verteilen
        }
        else {
            // bcd und hex zeigt von rechts nach links so viele Spalten an, wie die Zahl Ziffern hat
            // wenn die nächste Zahl weniger Ziffern hat, werden die links daneben nicht gelöscht
            // pro Ziffer werden mit zeigeBIN immer 5 LEDs geschaltet, die obere 2^4 ist immer aus
            while (int > 0 && between(xLed, 0, 4)) {
                if (format == ePlot.bcd) {
                    zeigeBIN(int % 10, ePlot.bin, xLed) // Ziffer 0..9
                    int = Math.idiv(int, 10) // 32 bit signed integer
                }
                else if (format == ePlot.hex) {
                    zeigeBIN(int % 16, ePlot.bin, xLed) // Ziffer 0..15
                    int = int >>> 4 // bitweise Division durch 16
                }
                xLed--
            }
        }
    }

    // group="BIN" subcategory="25 LED Display"
    // block="zeige ↕↕↕↕↕ %int255 map255 ←x %xLed" weight=2
    // int255.min=0 int255.max=255 
    // xLed.min=0 xLed.max=4 xLed.defl=4
    function zeigeBIN_map255(int255: number, xLed: number) {
        if (int255 == 0)
            zeigeBIN(0, ePlot.bin, xLed)
        else
            zeigeBIN(mapInt32(int255, 1, 255, 1, 31), ePlot.bin, xLed) // 8 Bit auf 5 Bit verteilen
    }


    let n_showString = ""

    //% group="Text" subcategory="25 LED Display"
    //% block="zeige Text wenn geändert %text" weight=1
    //% text.shadow="btf_text"
    export function zeigeText(text: any) {
        let tx = convertToText(text)
        if (n_showString != tx) {
            n_showString = tx
            basic.showString(tx)
            setClearScreen()
        }
    }

    export function zeigeHexFehler(n: number) {
        // zeigeText(Buffer.fromArray([n]).toHex())
        zeigeBIN(n, ePlot.hex, 4)
    }



    // ========== group="Funktionen"

    //% blockId=btf_text block="%s" blockHidden=true
    export function btf_text(s: string): string { return s }

    //% group="Funktionen" subcategory="25 LED Display"
    //% block="// %text" weight=9
    //% text.shadow="btf_text"
    export function comment(text: any): void { }

    //% group="Funktionen" subcategory="25 LED Display"
    //% block="Simulator" weight=7
    export function simulator() {
        return "€".charCodeAt(0) == 8364
    }

    //% group="Funktionen" subcategory="25 LED Display"
    //% block="%i0 zwischen %i1 und %i2" weight=6
    export function between(i0: number, i1: number, i2: number): boolean {
        return (i0 >= i1 && i0 <= i2)
    }

    //% group="Funktionen" subcategory="25 LED Display"
    //% block="mapInt32 %value|from low %fromLow|high %fromHigh|to low %toLow|high %toHigh" weight=3
    //% fromLow.defl=1 fromHigh.defl=255 toLow.defl=-100 toHigh.defl=100
    //% inlineInputMode=inline
    export function mapInt32(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
        // return ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow
        return Math.idiv(Math.imul(value - fromLow, toHigh - toLow), fromHigh - fromLow) + toLow
    }

}