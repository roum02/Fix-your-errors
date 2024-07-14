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

    /** to check the end of the word */
    const isEndOfWord = (currentChar: string, nextChar: string | undefined, prevChar: string | undefined): boolean => {

        // 중성 + 초성
        if (isJungseong(currentChar) && nextChar && isChoseong(nextChar)) {
            return true;
        }
        // 종성 + 초성
        if (isJongseong(currentChar) && nextChar && isChoseong(nextChar)) {
            return true;
        }
        // 초성 + 초성 or 초성 + undefined
        if (isChoseong(currentChar) && (!nextChar || isChoseong(nextChar))) {
            return true;
        }
        // 종성 + 중성
        // if (isJongseong(currentChar) && nextChar && isJungseong(nextChar)) {
        //     return true;
        // }
        // 초성 + 중성 + 종성
        if (prevChar && isChoseong(prevChar) && isJungseong(currentChar) && nextChar && (isChoseong(nextChar) || isJongseong(nextChar))) {
            return true;
        }
        return false;
    };

    console.log("1. koreanCharacterArray: ", koreanCharacterArray)

    words = koreanCharacterArray.reduce((acc: string[], char, i, array) => {
        const nextChar = array[i + 1];
        const prevChar = array[i - 1];
        if (i === array.length - 1 || isEndOfWord(char, nextChar, prevChar)) {
            acc.push(array.slice(start, i + 1).join(''));
            start = i + 1;
        }
        /** 자음 하나로 묶기 */
        // string 길이가 1이면서 자음인 경우 앞이랑 합치기
        console.log("반복문: ",isEndOfWord(char, nextChar, prevChar), char, acc)
        if (acc.length > 0 && acc[acc.length - 1].length === 1 && isChoseong(acc[acc.length - 1]) && acc.length > 1) {
            let originString = acc[acc.length - 2];
            originString += acc[acc.length - 1];
            acc.splice(acc.length - 2, 2);
            acc.push(originString);
        }

        return acc;
    }, []);

    console.log("3. words :", words)

    /** convert dubble letter */
    const processWord = (word: string): string => {
        let wordArray = word.split('');

        /** 이중모음 */
        const processJungseong = (arr: string[], startIndex: number): void => {
            if (isJungseong(arr[startIndex]) && isJungseong(arr[startIndex + 1])) {
                let original = arr[startIndex];
                arr[startIndex] = makeJungseongList(arr.slice(startIndex, startIndex + 2));
                if (original !== arr[startIndex]) {
                    arr.splice(startIndex + 1, 1);
                }
            }
        };

        /** 이중자음 */
        const processJongseong = (arr: string[], startIndex: number): void => {
            if (isJongseong(arr[startIndex]) && isJongseong(arr[startIndex + 1])) {
                let original = arr[startIndex];
                console.log("original:", original)
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

    console.log("4. after processWord", words)


    console.log("combine: ", combineKoreanCharacter(words))

    return combineKoreanCharacter(words)
}
