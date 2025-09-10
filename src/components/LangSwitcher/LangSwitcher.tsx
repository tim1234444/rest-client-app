'use client';
import { usePathname, useRouter } from '@/src/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function LangSwitcher() {
  const router = useRouter();
  const t = useTranslations('root');
  const locale = useLocale();
  const pathName = usePathname();
  return (
    <fieldset className="flex gap-2">
      <legend className="text-center"> {t('lang')}:</legend>
      <input
        type="radio"
        name="language"
        id="en"
        value={'en'}
        checked={locale === 'en' ? true : false}
        onChange={async (e) => {
          router.replace(pathName, { locale: e.target.value });
        }}
      />
      <label htmlFor="en">{t('en')}</label>
      <input
        type="radio"
        name="language"
        id="ru"
        value={'ru'}
        checked={locale === 'ru' ? true : false}
        onChange={async (e) => {
          router.replace(pathName, { locale: e.target.value });
        }}
      />
      <label htmlFor="ru">{t('ru')}</label>
    </fieldset>
  );
}
