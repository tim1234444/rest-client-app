import React from 'react';
import { Team } from '@/src/type/type';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Props {
  member: Team;
}

export default function TeamMemberCard({ member }: Props) {
  const t = useTranslations('about');
  return (
    <div className="rounded-2xl shadow-lg p-4 bg-transparent max-w-80 text-center">
      <Image
        src={member.photoUrl}
        alt={t(member.name)}
        className="w-32 h-32 rounded-full mx-auto object-cover"
        width="128"
        height="128"
      />
      <h2 className="text-xl font-semibold mt-2">{t(member.name)}</h2>
      <p className="text-gray-600">{t(member.role)}</p>
      <p className="text-sm mt-2">{t(`bio ${member.name}`)}</p>
      <p className="text-sm italic mt-2">{t(`Contributions ${member.name}`)}</p>
      <a
        href={member.gitHubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 no-underline block mt-2 hover:underline"
      >
        {t('GitHub profile')}
      </a>
    </div>
  );
}
