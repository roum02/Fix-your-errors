import { CHOSEONG, JONGSEONG, JUNGSEONG, KOREAN_DICTIONARY} from '../data/dictionary'

/** get a korean character matched an english character*/
export const handleEnglishCharacterMatch = (englishText: string) => {
    let koreanTextArray: string[] = [];
    for(const char of englishText){
        const matchedKoreanChar = KOREAN_DICTIONARY.get(char);
        if(matchedKoreanChar){
            koreanTextArray.push(matchedKoreanChar);
        } else {
            koreanTextArray.push(char)
        }
    }

    return koreanTextArray;
}

/** change split character to korean  */
const combineKoreanCharacter = (characterArray: string[]) => {
    const [choseong, jungseong, jongseong] = characterArray;

    const choseongIndex = CHOSEONG.get(choseong) as number;
    const jungseongIndex = JUNGSEONG.get(jungseong) as number;
    const jongseongIndex = JONGSEONG.get(jongseong) || 0;

    // console.log(choseong, jungseong, jongseong)

    const hangulChar =  String.fromCharCode(0xAC00 + (choseongIndex * 21 * 28) + (jungseongIndex * 28) + jongseongIndex)
    console.log("hangulChar", hangulChar)
    return hangulChar;
}

/** combine a korean character to make a korean word */
export const handleKoreanWord = (characterArray: string[]) => {
    let hangulString = '';
    let buffer: string[] = [];

    const isJungseong = (char: string) => JUNGSEONG.has(char);
    const isChoseong = (char: string) => CHOSEONG.has(char);
    const isJongseong = (char: string) => JONGSEONG.has(char);


    characterArray.forEach((char, index)=> {
        buffer.push(char);

        if (buffer.length === 3 && isChoseong(buffer[0]) && isJungseong(buffer[1]) && isJongseong(buffer[2])) {
            hangulString += combineKoreanCharacter(buffer);
            buffer = [];
        }
    });

    if (buffer.length > 0) {
        while (buffer.length < 3) {
            buffer.push('');
        }
        hangulString += combineKoreanCharacter(buffer);
    }
    console.log("final", hangulString)
    return hangulString;
}
