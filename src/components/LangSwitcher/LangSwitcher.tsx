'use client';
import { useEffect, useState } from 'react';
import { switchLang } from '@/src/dictionaries/dictionaries';
import type { ILang } from '@/src/dictionaries/dictionaries';

export default function LangSwitcher() {
    const [lang, setLang] = useState<ILang>(null);

    useEffect (() => {
    }, [lang, setLang])

    return (
        <label htmlFor="lang"> {lang === null ? 'Change lang' : `${lang.root.lang}`}:
            <select name="lang" id="lang" onChange={async (e) => await switchLang(e.target.value, setLang)}>
                <option value="en">{lang === null ? 'EN' : `${lang.root.en}`}</option>
                <option value="ru">{lang === null ? 'RU' : `${lang.root.ru}`}</option>
            </select>
        </label>
    );
}