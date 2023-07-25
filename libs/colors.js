module.exports = {
    Reset: '\x1b[0m',
    Bold: '\x1b[1m',

    Red: '\x1b[31m',
    LightRed: '\x1b[91m',
    BgRed: '\x1b[41m',
    BgLightRed: '\x1b[101m',
  
    Yellow: '\x1b[33m',
    LightYellow: '\x1b[93m',
    BgYellow: '\x1b[43m',
    BgLightYellow: '\x1b[103m',
  
    Blue: '\x1b[34m',
    LightBlue: '\x1b[94m',
    BgBlue: '\x1b[44m',
    BgLightBlue: '\x1b[104m',
  
    Magenta: '\x1b[35m',
    LightMagenta: '\x1b[95m',
    BgMagenta: '\x1b[45m',
    BgLightMagenta: '\x1b[105m',
  
    Cyan: '\x1b[36m',
    LightCyan: '\x1b[96m',
    BgCyan: '\x1b[46m',
    BgLightCyan: '\x1b[106m',
  
    Green: '\x1b[32m',
    LightGreen: '\x1b[92m',
    BgGreen: '\x1b[42m',
    BgLightGreen: '\x1b[102m',
  
    Black: '\x1b[30m',
    Gray: '\x1b[90m',
    BgBlack: '\x1b[40m',
    BgGray: '\x1b[100m',
  
    White: '\x1b[37m',
    LightWhite: '\x1b[97m',
    BgWhite: '\x1b[47m',
    BgLightWhite: '\x1b[107m',

    hex(hexColor) {
        const hex = hexColor.replace(/^#/, '');
      
        if (hex.length !== 3 && hex.length !== 6) {
            throw new Error('Invalid hex color format');
        }
      
        const isShortHex = hex.length === 3;
      
        // Convert short hex to full hex format
        const fullHex = isShortHex
            ? hex
                    .split('')
                    .map((char) => char + char)
                    .join('')
            : hex;
      
        const red = parseInt(fullHex.slice(0, 2), 16);
        const green = parseInt(fullHex.slice(2, 4), 16);
        const blue = parseInt(fullHex.slice(4, 6), 16);
      
        return `\x1b[38;2;${red};${green};${blue}m`
    },

    hexBg(hexColor) {
        const hex = hexColor.replace(/^#/, '');
      
        if (hex.length !== 3 && hex.length !== 6) {
            throw new Error('Invalid hex color format');
        }
      
        const isShortHex = hex.length === 3;
      
        // Convert short hex to full hex format
        const fullHex = isShortHex
            ? hex
                    .split('')
                    .map((char) => char + char)
                    .join('')
            : hex;
      
        const red = parseInt(fullHex.slice(0, 2), 16);
        const green = parseInt(fullHex.slice(2, 4), 16);
        const blue = parseInt(fullHex.slice(4, 6), 16);
      
        return `\x1b[48;2;${red};${green};${blue}m`
    }
}