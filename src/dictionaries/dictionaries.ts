export interface ILang {
    root: {
        lang: string;
    }
}

export async function switchLang(value = 'en', setLang: (d: ILang) => void) {
    if (value === 'en') {
        const dict = await getDictionary(value);
        await setLang(dict);
        return;
    };
    if (value === 'ru') {
        const dict = await getDictionary(value);
        await setLang(dict);
        return;
    };
}

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  ru: () => import('./ru.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'ru') =>
  dictionaries[locale]()