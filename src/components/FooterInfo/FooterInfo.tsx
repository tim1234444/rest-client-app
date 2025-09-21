import Image from 'next/image';
import { teamData } from '../AboutUsInfo/teamData';
import { useTranslations } from 'next-intl';

export default function FooterInfo() {
  const t = useTranslations('footer');
  return (
    <div className="flex items-center gap-8">
      {teamData.map((person) => (
        <a
          className="transition-transform duration-300 ease-in-out hover:scale-105 text-sm"
          href={person.gitHubUrl}
          target="_blank"
          rel="noopener noreferrer"
          key={person.gitHubUrl}
        >
          {t(person.name)}
        </a>
      ))}

      <a href="https://rs.school/courses/reactjs" target="_blank" rel="noopener noreferrer">
        <Image
          className="transition-transform duration-300 ease-in-out hover:scale-110 w-auto h-8 min-w-[32px] object-contain border border-white rounded-full"
          src="/rss-logo.svg"
          alt={t('rsSchoolLogo')}
          width="32"
          height="32"
        />
      </a>
    </div>
  );
}
