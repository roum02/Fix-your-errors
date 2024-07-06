"use client";

import { useState } from "react";
import { handleEnglishCharacterMatch, handleKoreanWord } from '../utils'

export default function MainPage() {
    const [englishText, setEnglishText] = useState('')

    const handleSubmitButton = () => {
        const koreanTextArray = handleEnglishCharacterMatch(englishText) as string[];
        console.log(handleKoreanWord(koreanTextArray))
        handleKoreanWord(koreanTextArray);
    }

    return (
        <main>
            <menu>
                <span>real-time</span>
                <span>submit</span>
            </menu>
            <h1> Fix your Typing Error here! </h1>
            <p>origin</p>
            <textarea onChange={(e) => {
                setEnglishText(e.target.value)
            }} />
            <button onClick={handleSubmitButton}>submit</button>
            <p>fixed version</p>
            <textarea/>
        </main>
    );
}
