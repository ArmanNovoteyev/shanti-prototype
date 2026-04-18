import { useTranslation } from '../hooks/useTranslation.js';

export default function BonusScreen() {
  const { t } = useTranslation();
  return (
    <div style={{ padding: '24px', textAlign: 'center', color: '#344237' }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
        {t('bonus.title')}
      </h2>
      <p style={{ color: '#8A8B86', fontSize: '13px' }}>BonusScreen coming soon</p>
    </div>
  );
}
