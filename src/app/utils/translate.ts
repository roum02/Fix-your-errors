import {CHOSEONG, JONGSEONG, jongseongObj, JUNGSEONG, jungseongObj, KOREAN_DICTIONARY} from '../data/dictionary'

const makeJongseongList = ( charList: string[]): string => {
    const key = charList.join('');
    return jongseongObj[key] || charList[0];
}

const makeJungseongList = (charList: string[]): string => {
    const key = charList.join('');
    return jungseongObj[key] || charList[0];
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

/** Check if the character is a Korean consonant or vowel */
const isKoreanConsonantOrVowel = (char: string): boolean => {
    const code = char.charCodeAt(0);
    const isConsonant = (code >= 12593 && code <= 12622);
    const isVowel = (code >= 12623 && code <= 12643);

    return isConsonant || isVowel;
};

/** change split character to korean  */
const combineKoreanCharacter = (characterArray: string[]): string => {
    /** Except special characters */
    if (characterArray.some(char => !isKoreanConsonantOrVowel(char))) {
        return characterArray.find(char => !isKoreanConsonantOrVowel(char))!;
    }

    const [choseong, jungseong, jongseong] = characterArray;

    const choseongIndex = CHOSEONG.get(choseong) as number;
    const jungseongIndex = JUNGSEONG.get(jungseong) as number;
    const jongseongIndex = JONGSEONG.get(jongseong) || 0;

    const hangulChar =  String.fromCharCode(0xAC00 + (choseongIndex * 21 * 28) + (jungseongIndex * 28) + jongseongIndex)
    return hangulChar;
}

/** combine a korean character to make a korean word */
export const handleKoreanWord = (koreanCharacterArray: string[]) => {
    let words: string[] = [];
    let start = 0;

    const isJungseong = (char: string) => JUNGSEONG.has(char);
    const isChoseong = (char: string, nextChar?: string) => {
        return CHOSEONG.has(char) && nextChar && isJungseong(nextChar)
    };
    const isJongseong = (char: string) => JONGSEONG.has(char);

    /** Check if the current character is the end of a word */
    const isEndOfWord = (currentChar: string, nextChar: string | undefined, afterNextChar: string | undefined, prevChar: string | undefined): boolean => {

        // 중성 + 초성
        if (isJungseong(currentChar) && nextChar && isChoseong(nextChar, afterNextChar)) {
            return true;
        }
        // 종성 + 초성
        if (isJongseong(currentChar) && nextChar && isChoseong(nextChar, afterNextChar)) {
            return true;
        }
        // 초성 + 초성 or 초성 + undefined
        if (isChoseong(currentChar, nextChar) && (!nextChar || isChoseong(nextChar, afterNextChar))) {
            return true;
        }
        // (초성 + 중성) + 종성
        if(prevChar && isJungseong(prevChar) && isJongseong(currentChar) && !isChoseong(currentChar, nextChar)){
            return true
        }
        // 중성 + 끝(특수문자)
        // TODO 특수문자가 들어가는 더 많은 케이스 분석 필요
        if(isJungseong(currentChar) && (nextChar && !isKoreanConsonantOrVowel(nextChar))){
            return true
        }
        return false;
    };

    /** convert dubble letter */
    const processWord = (word: string): string => {
        const wordArray = word.split('');

        const processDoubleLetter = (arr: string[], startIndex: number, isDoubleFunc: (char: string) => boolean, makeListFunc: (subArr: string[]) => string): void => {
            if (isDoubleFunc(arr[startIndex]) && isDoubleFunc(arr[startIndex + 1])) {
                const original = arr[startIndex];
                arr[startIndex] = makeListFunc(arr.slice(startIndex, startIndex + 2));
                if (original !== arr[startIndex]) {
                    arr.splice(startIndex + 1, 1);
                }
            }
        };

        if (wordArray.length > 2 && isChoseong(wordArray[0]) && isJungseong(wordArray[1])) {
            processDoubleLetter(wordArray, 1,isJungseong, makeJungseongList);
        }

        if (wordArray.length >= 4 && isJongseong(wordArray[2]) && isJongseong(wordArray[3])) {
            processDoubleLetter(wordArray, 2, isJongseong, makeJongseongList);
        }

        return wordArray.join('');
    };


    /** split korean characters into syllables */
    koreanCharacterArray.reduce((acc: string[], char, i, array) => {
        const nextChar = array[i + 1];
        const afterNextChar = array[i + 2]
        const prevChar = array[i - 1];

        // 특수문자인 경우 그냥 넣어주기
        if(!isKoreanConsonantOrVowel(char)){
            acc.push(char)
            start = i + 1;
        }

        // 현재 문자와 다음 문자를 기준으로 음절 경계를 판단하여 음절을 분리
        if (i === array.length - 1 || isEndOfWord(char, nextChar, afterNextChar, prevChar)) {
            acc.push(array.slice(start, i + 1).join(''));
            start = i + 1;
        }

        // 자음 하나로 묶기: 단일 자음이 있는 경우 이전 음절과 합침
        const lastWord = acc[acc.length - 1];
        if (lastWord && lastWord.length === 1 && isChoseong(lastWord) && acc.length > 1) {
            const mergedWord = acc[acc.length - 2] + lastWord;
            acc.splice(acc.length - 2, 2, mergedWord);
        }

        return acc;
    }, words);

    const processedWords = words.map(processWord);

    // combineKoreanCharacter 함수를 사용하여 변환된 한글 음절 배열 생성
    const combinedWords: string = processedWords.map(item => combineKoreanCharacter(item.split(''))).join('')

    return combinedWords;
}
