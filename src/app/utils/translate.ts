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
// 자음 하나 + 모음 하나 = 한 음절
    characterArray.forEach(
        char => {
            buffer.push(char);
            // 종성 여부 파악
            if (buffer.length === 3) {
                hangulString += combineKoreanCharacter(buffer);
                buffer = [];
            } else if (
                buffer.length === 2 &&
                !CHOSEONG.has(buffer[1]) &&
                buffer[1] !== undefined &&
                (CHOSEONG.has(char) || !JUNGSEONG.has(char))
            ) {
                buffer.push('');
                hangulString += combineKoreanCharacter(buffer);
                buffer = [char];
            }

            // 이중모음 케이스
        })

    if (buffer.length > 0) {
        while (buffer.length < 3) {
            buffer.push('');
        }
        hangulString += combineKoreanCharacter(buffer);
    }

    console.log("final", hangulString)
    return hangulString;
}