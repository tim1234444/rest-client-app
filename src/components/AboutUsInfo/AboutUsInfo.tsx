import React from 'react';
import { memo } from 'react';
import { teamData } from './teamData';
import TeamMemberCard from './TeamMemberCard';
import { useTranslations } from 'next-intl';

const AboutUsInfo = memo(function About() {
  const t = useTranslations('about');

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">{t('About our team, project and course')}</h1>
      <p className="mb-6 text-lg indent-8 text-justify">{t('description')}</p>
      <div className="grid grid-cols-3 gap-6 justify-items-center mb-8">
        {teamData.map((member) => (
          <TeamMemberCard key={member.gitHubUrl} member={member} />
        ))}
      </div>
    </div>
  );
});

export default AboutUsInfo;
