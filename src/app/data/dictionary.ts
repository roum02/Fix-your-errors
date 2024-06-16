const singleConsonants = {
    'q': 'q','w':'w','e':'e','r':'r','t':'t',
    'a':'a','s':'s','d':'d','f':'f','g':'g',
    'z':'z','x':'x','c':'c','v':'v'
}

const doubleConsonants = {
    'Q':'Q','W':'W','E':'E','R':'R','T':'T',
}

const singleVowels = {
    'y':'y','u':'u','i':'i','o':'o','p':'p',
    'h':'h','j':'j','k':'k','l':'l',
    'b':'b','n':'n','m':'m'
}

const doubleVowels = {
    'O':'O','P':'P'
}

export const koreanDictionary = new Map([
    ['p','ㅂ'], ['Q', 'ㅃ'], ['w', 'ㅈ'], ['W','ㅉ'],
    ['e','ㄷ'], ['E','ㄸ'], ['r','ㄱ'], ['R','ㄲ'], ['t','ㅅ'],
    ['T','ㅆ'], ['y','ㅛ'], ['u','ㅕ'], ['i','ㅑ'], ['o','ㅐ'],
    ['p','ㅔ'], ['a','ㅁ'], ['s','ㄴ'], ['d','ㅇ'], ['f','ㄹ'],
    ['g','ㅎ'], ['h','ㅗ'], ['j','ㅓ'], ['k','ㅏ'], ['l','ㅣ'],
    ['z','ㅋ'], ['x','ㅌ'], ['c','ㅊ'], ['v','ㅍ'], ['b','ㅠ'],
    ['n','ㅜ'], ['m','ㅡ'], ['O','ㅒ'], ['P','ㅖ'], ['Y','ㅛ'],
    ['U','ㅕ'], ['I','ㅑ'], ['H','ㅗ'], ['J','ㅓ'], ['K','ㅏ'],
    ['L','ㅣ'], ['B','ㅠ'], ['N','ㅜ'], ['M','ㅡ'], ['A','ㅁ'],
    ['S','ㄴ'], ['D','ㅇ'], ['F','ㄹ'], ['G','ㅎ'], ['Z','ㅋ'],
    ['X','ㅌ'], ['C','ㅊ'], ['V','ㅍ']
])

export const consonants = {
    ...singleConsonants, ...doubleConsonants
}

export const vowels = {
    ...singleVowels, ...doubleVowels
}
