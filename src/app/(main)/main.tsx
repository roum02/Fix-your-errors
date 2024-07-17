"use client";

import { useState } from "react";
import { handleEnglishCharacterMatch, handleKoreanWord } from '../utils'

export default function MainPage() {
    const [englishChar, setEnglishChar] = useState('')
    const [koreanChar, setKoreanChar] = useState('')

    const handleSubmitButton = () => {
        const koreanTextArray = handleEnglishCharacterMatch(englishChar) as string[];

        let changedValue = handleKoreanWord(koreanTextArray);
        setKoreanChar(changedValue)
    }

    const handleReset = () => {
        setEnglishChar('')
        setKoreanChar('')
    }

    return (
        <main>
            <h1> Fix your Typing Error here! </h1>
            <p>origin</p>
            <textarea onChange={(e) => {
                setEnglishChar(e.target.value)
            }}
            value={englishChar}
            />
            <button onClick={handleSubmitButton}>submit</button>
            <button onClick={handleReset}>reset</button>
            <p>fixed version</p>
            <textarea value={koreanChar} readOnly />
        </main>
    );
}
