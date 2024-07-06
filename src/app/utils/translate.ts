import { CHOSEONG, JONGSEONG, JUNGSEONG, KOREAN_DICTIONARY} from '../data/dictionary'

/** get a korean character matched an english character*/
export const handleEnglishCharacterMatch = (englishText: string) => {
    let koreanTextArray = [];
    for(const text of englishText){
        if(KOREAN_DICTIONARY.has(text)){
            koreanTextArray.push(KOREAN_DICTIONARY.get(text));
        } else {
            koreanTextArray.push(text)
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

    console.log(choseong, jungseong, jongseong)

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

        if (buffer.length === 3 && isChoseong(buffer[0]) && isJungseong(buffer[1])) {
            hangulString += combineKoreanCharacter(buffer);
            buffer = [];
        }
        else if (buffer.length === 2 && isChoseong(buffer[0]) && isJungseong(buffer[1])) {
            buffer.push('');
            hangulString += combineKoreanCharacter(buffer);
            buffer = [];
        }
        else if (buffer.length === 3 && isJungseong(buffer[0]) && isJungseong(buffer[1]) && isChoseong(buffer[2])) {
            hangulString += combineKoreanCharacter([buffer[0], buffer[1], '']);
            buffer = [buffer[2]];
        }
        else if (buffer.length === 4 && isJungseong(buffer[0]) && isJungseong(buffer[1]) && isChoseong(buffer[2]) && isJongseong(buffer[3])) {
            hangulString += combineKoreanCharacter([buffer[0], buffer[1], '']);
            buffer = [buffer[2], buffer[3]];
        }
    });

    if (buffer.length > 0) {
        while (buffer.length < 3) {
            buffer.push('');
        }
        hangulString += combineKoreanCharacter(buffer);
    }

    // console.log("final", hangulString)
    return hangulString;
}