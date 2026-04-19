import { useTranslation } from '../hooks/useTranslation.js';
import { colors } from '../theme/colors.js';

const display = { fontFamily: "'Fraunces', serif", fontWeight: 500, letterSpacing: '-0.02em' };
const body = { fontFamily: "'Manrope', sans-serif" };

function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function ServiceStages({ stages }) {
  const { t, localized } = useTranslation();
  if (!Array.isArray(stages) || stages.length === 0) return null;

  return (
    <div style={{ padding: '28px 24px 0' }}>
      <div
        style={{
          background: colors.cream,
          borderRadius: 16,
          padding: '18px 20px',
        }}
      >
        <div
          style={{
            ...body,
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: colors.textMuted,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {t('service_detail.stages_title')}
        </div>

        {stages.map((stage, i) => {
          const label = localized(stage, 'label');
          const minutes = stage.duration && stage.unit === 'min' ? stage.duration : null;
          return (
            <div
              key={stage.id || i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                padding: '8px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${colors.sand}`,
              }}
            >
              <div
                style={{
                  ...display,
                  fontSize: 14,
                  color: colors.copper,
                  fontWeight: 600,
                  flexShrink: 0,
                  minWidth: 22,
                }}
              >
                {pad2(i + 1)}
              </div>
              <div
                style={{
                  ...body,
                  fontSize: 14,
                  color: colors.textMain,
                  lineHeight: 1.45,
                  flex: 1,
                }}
              >
                {label}
              </div>
              {minutes ? (
                <div
                  style={{
                    ...body,
                    fontSize: 12,
                    color: colors.textMuted,
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}
                >
                  {minutes} {t('common.minutes_short')}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
