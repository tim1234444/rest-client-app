export interface ILang {
    root: {
        lang: string;
    }
}

export async function switchLang(value = 'en', setLang: (d: ILang) => void) {
  console.log('switch foo value', value);
  if (value === 'ru') {
        const dict = await getDictionary('ru');
        await setLang(dict);
        return;
    };

    if (value === 'en') {
        const dict = await getDictionary('en');
        await setLang(dict);
        return;
    };

}

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  ru: () => import('./ru.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'ru') =>
  await dictionaries[locale]()