'use client';
import React from 'react';
import { teamData } from './teamData';
import { TeamMemberCard } from './TeamMemberCard';
import { useTranslations } from 'next-intl';
import styles from './AboutUsInfo.module.css';

const AboutUsInfo: React.FC = () => {
  const t = useTranslations('about');

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{t('About our team, project and course')}</h1>
      <p className={styles.description}>{t('description')}</p>
      <div className={styles.grid}>
        {teamData.map((member) => (
          <TeamMemberCard key={member.gitHubUrl} member={member} />
        ))}
      </div>
    </div>
  );
};

export default AboutUsInfo;
