'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { switchLang } from '@/src/dictionaries/dictionaries';
import type { ILang } from '@/src/dictionaries/dictionaries';

const defaultLangState = {
    "root": {
    "lang": "Change lang",
    "en": "English",
    "ru": "Russian",
    "locale": "en"
  }
}

export default function LangSwitcher() {
    const router = useRouter()
    const [lang, setLang] = useState<ILang>(defaultLangState);
    useEffect (() => {
        console.log(lang)
    },[lang])

    return (
        <fieldset className='flex gap-2'>
            <legend > {lang.root.lang}:</legend>
            <input type='radio' name="language" id="en" value={'en'} checked={lang.root.locale === 'en' ? true : false} onChange={async (e) => {
                console.log('Value:', e.target.value);
                // setLocal(e.target.value);
                router.push('/' + e.target.value);
                await switchLang(e.target.value, setLang);
            }}/>
            <label htmlFor="en">EN</label>
            <input type='radio' name="language" id="ru" value={'ru'} checked={lang.root.locale === 'ru' ? true : false} onChange={async (e) => {
                console.log('Value:', e.target.value);
                // setLocal(e.target.value);
                router.push('/' + e.target.value);
                await switchLang(e.target.value, setLang);
            }} />
            <label htmlFor="ru">RU</label>
        </fieldset>
    );
}