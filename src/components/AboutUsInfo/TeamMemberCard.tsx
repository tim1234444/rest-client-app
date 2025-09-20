import React from 'react';
import { Team } from '@/src/type/type';
import { useTranslations } from 'next-intl';
import styles from './TeamMemberCard.module.css';

interface Props {
  member: Team;
}

export const TeamMemberCard: React.FC<Props> = ({ member }) => {
  const t = useTranslations('about');
  return (
    <div className={styles.card}>
      <img src={member.photoUrl} alt={t(member.name)} className={styles.photo} />
      <h2 className={styles.name}>{t(member.name)}</h2>
      <p className={styles.role}>{t(member.role)}</p>
      <p className={styles.bio}>{t(`bio ${member.name}`)}</p>
      <p className={styles.contributions}>💡 {t(`Contributions ${member.name}`)}</p>
      <a
        href={member.gitHubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubLink}
      >
        {t('GitHub profile')}
      </a>
    </div>
  );
};
