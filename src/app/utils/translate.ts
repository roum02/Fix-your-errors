import { CHOSEONG, JONGSEONG, JUNGSEONG, KOREAN_DICTIONARY} from '../data/dictionary'

/** TODO this file should be moved */
const jongseongMap: { [key: string]: string } = {
    'ㄱㄱ': 'ㄲ',
    'ㄱㅅ': 'ㄳ',
    'ㄴㅈ': 'ㄵ',
    'ㄴㅎ': 'ㄶ',
    'ㄹㄱ': 'ㄺ',
    'ㄹㅁ': 'ㄻ',
    'ㄹㅂ': 'ㄼ',
    'ㄹㅅ': 'ㄽ',
    'ㄹㅌ': 'ㄾ',
    'ㄹㅍ': 'ㄿ',
    'ㄹㅎ': 'ㅀ',
    'ㅂㅅ': 'ㅄ'
};

const jungseongMap: { [key: string]: string } = {
    'ㅗㅏ': 'ㅘ',
    'ㅗㅐ': 'ㅙ',
    'ㅗㅣ': 'ㅚ',
    'ㅜㅓ': 'ㅝ',
    'ㅜㅔ': 'ㅞ',
    'ㅜㅣ': 'ㅟ',
    'ㅡㅣ': 'ㅢ'
};

const makeJongseongList = ( charList: string[]): string => {
    const key = charList.join('');
    return jongseongMap[key] || charList[0];
}

const makeJungseongList = (charList: string[]): string => {
    const key = charList.join('');
    return jungseongMap[key] || charList[0];
}


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

    const hangulChar =  String.fromCharCode(0xAC00 + (choseongIndex * 21 * 28) + (jungseongIndex * 28) + jongseongIndex)
    return hangulChar;
}

/** combine a korean character to make a korean word */
export const handleKoreanWord = (koreanCharacterArray: string[]) => {
    let hangulString = '';
    let words: string[] = [];
    let start = 0;

    const isJungseong = (char: string) => JUNGSEONG.has(char);
    const isChoseong = (char: string) => CHOSEONG.has(char);
    const isJongseong = (char: string) => JONGSEONG.has(char);

    /** to check the end of the word
     * 1) after Jungseong
     * 2) after Jongseong
     * */
    const isEndOfWord = (currentChar: string, nextChar: string | undefined): boolean => {
        return ((isJungseong(currentChar) && nextChar && isChoseong(nextChar)) ||
            (isJongseong(currentChar) && nextChar && isChoseong(nextChar))) || false;
    };

    console.log("1. koreanCharacterArray: ", koreanCharacterArray)

    words = koreanCharacterArray.reduce((acc: string[], char, i, array) => {
        const nextChar = array[i + 1];
        if (i === array.length - 1 || isEndOfWord(char, nextChar)) {
            acc.push(array.slice(start, i + 1).join(''));
            start = i + 1;
        }
        return acc;
    }, []);

    console.log("3. words :", words)

    const processWord = (word: string): string => {
        let wordArray = word.split('');
        //console.log("wordArray: ", wordArray)

        const processJungseong = (arr: string[], startIndex: number): void => {
            if (isJungseong(arr[startIndex]) && isJungseong(arr[startIndex + 1])) {
                let original = arr[startIndex];
                arr[startIndex] = makeJungseongList(arr.slice(startIndex, startIndex + 2));
                if (original !== arr[startIndex]) {
                    arr.splice(startIndex + 1, 1);
                }
            }
        };

        const processJongseong = (arr: string[], startIndex: number): void => {
            if (isJongseong(arr[startIndex]) && isJongseong(arr[startIndex + 1])) {
                let original = arr[startIndex];
                arr[startIndex] = makeJongseongList(arr.slice(startIndex, startIndex + 2));
                if (original !== arr[startIndex]) {
                    arr.splice(startIndex + 1, 1);
                }
            }
        };

        if (wordArray.length > 2 && isChoseong(wordArray[0]) && isJungseong(wordArray[1])) {
            processJungseong(wordArray, 1);
        }

        if (wordArray.length >= 4 && isJongseong(wordArray[2]) && isJongseong(wordArray[3])) {
            processJongseong(wordArray, 2);
        }

        return wordArray.join('');
    };

    words = words.map(processWord);

    console.log("after processWord", words)
    console.log("combine: ", combineKoreanCharacter(words))

    return combineKoreanCharacter(words)
}
