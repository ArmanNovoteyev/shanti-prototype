import { useTranslation } from '../hooks/useTranslation.js';
import { colors } from '../theme/colors.js';

export default function BookingsListScreen() {
  const { t } = useTranslation();
  return (
    <div style={{ padding: '24px', textAlign: 'center', color: colors.deepBrown }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
        {t('bookings.title')}
      </h2>
      <p style={{ color: colors.textMuted, fontSize: '13px' }}>BookingsListScreen coming soon</p>
    </div>
  );
}
