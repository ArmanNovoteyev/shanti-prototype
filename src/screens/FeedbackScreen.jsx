import { useTranslation } from '../hooks/useTranslation.js';
import { colors } from '../theme/colors.js';
import { FONT_DISPLAY } from '../theme/fonts.js';

export default function FeedbackScreen() {
  const { t } = useTranslation();
  return (
    <div style={{ padding: '24px', textAlign: 'center', color: colors.deepBrown }}>
      <h2 style={{ ...FONT_DISPLAY }}>
        {t('feedback.title')}
      </h2>
      <p style={{ color: colors.textMuted, fontSize: '13px' }}>FeedbackScreen coming soon</p>
    </div>
  );
}
