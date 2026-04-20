import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '../hooks/useTranslation.js';
import { colors } from '../theme/colors.js';
import { FONT_FAMILY, FONT_DISPLAY } from '../theme/fonts.js';

const DESIGN_CONFIG = {
  ny: {
    background: '#1C2951',
    text: '#C9A961',
    textMuted: 'rgba(201,169,97,0.75)',
    accent: '#C9A961',
    logo: '/assets/logo/shanti-logo-on-dark.png',
    decor: 'snowflakes',
    label: 'Новый год',
    emoji: '🎄',
  },
  march8: {
    background: 'linear-gradient(135deg, #F4C2C2 0%, #FBF8F1 100%)',
    text: '#B8794A',
    textMuted: 'rgba(184,121,74,0.7)',
    accent: '#B8794A',
    logo: '/assets/logo/shanti-logo-on-light.png',
    decor: 'sakura',
    label: '8 марта',
    emoji: '🌷',
  },
  birthday: {
    background: '#5C1F2E',
    text: '#C9A961',
    textMuted: 'rgba(201,169,97,0.72)',
    accent: '#C9A961',
    logo: '/assets/logo/shanti-logo-on-dark.png',
    decor: 'thai',
    label: 'День рождения',
    emoji: '🎂',
  },
  dark: {
    background: '#4A3220',
    text: '#F2EDE3',
    textMuted: 'rgba(242,237,227,0.7)',
    accent: '#F2EDE3',
    logo: '/assets/logo/shanti-logo-on-dark.png',
    decor: 'minimal',
    label: 'Классика тёмная',
    emoji: '☕',
  },
  light: {
    background: '#FBF8F1',
    text: '#4A3220',
    textMuted: 'rgba(74,50,32,0.7)',
    accent: '#4A3220',
    logo: '/assets/logo/shanti-logo-on-light.png',
    decor: 'minimal',
    label: 'Классика светлая',
    emoji: '✨',
  },
};

export const GIFT_DESIGNS = ['ny', 'march8', 'birthday', 'dark', 'light'];
export const getDesignConfig = (id) => DESIGN_CONFIG[id] || DESIGN_CONFIG.light;

const LOGO_SHADOW_DESIGNS = new Set(['ny', 'march8', 'light']);

function formatAmount(v) {
  if (v == null) return '';
  return Number(v).toLocaleString('ru-RU').replace(/\u00a0/g, ' ') + ' ₸';
}

function formatDate(d) {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function Snowflake({ size, color, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <g stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.55">
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" />
        <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" />
        <path d="M12 5 L10 7 M12 5 L14 7 M12 19 L10 17 M12 19 L14 17" />
        <path d="M5 12 L7 10 M5 12 L7 14 M19 12 L17 10 M19 12 L17 14" />
      </g>
    </svg>
  );
}

function SakuraBranch({ width, color, style }) {
  return (
    <svg width={width} height={width * 0.7} viewBox="0 0 120 84" style={style} aria-hidden="true">
      <g stroke={color} strokeWidth="1.4" fill="none" opacity="0.6" strokeLinecap="round">
        <path d="M5 70 Q 35 55, 55 40 Q 78 22, 110 8" />
        <path d="M28 58 Q 20 52, 16 42" />
        <path d="M48 44 Q 55 32, 55 22" />
        <path d="M72 28 Q 82 24, 92 28" />
      </g>
      <g fill={color} opacity="0.7">
        <circle cx="16" cy="40" r="2.6" />
        <circle cx="18" cy="44" r="2" />
        <circle cx="55" cy="22" r="2.6" />
        <circle cx="58" cy="26" r="2" />
        <circle cx="92" cy="28" r="2.6" />
        <circle cx="96" cy="32" r="2" />
        <circle cx="110" cy="8" r="2.8" />
      </g>
    </svg>
  );
}

function ThaiOrnamentBorder({ color }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 500"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <rect x="14" y="14" width="772" height="472" fill="none" stroke={color} strokeWidth="1" opacity="0.55" />
      <rect x="22" y="22" width="756" height="456" fill="none" stroke={color} strokeWidth="0.6" opacity="0.35" />
      <g stroke={color} strokeWidth="0.9" fill="none" opacity="0.75">
        <path d="M14 58 Q 30 58 30 42 Q 30 26 46 26 L 58 26" />
        <path d="M786 58 Q 770 58 770 42 Q 770 26 754 26 L 742 26" />
        <path d="M14 442 Q 30 442 30 458 Q 30 474 46 474 L 58 474" />
        <path d="M786 442 Q 770 442 770 458 Q 770 474 754 474 L 742 474" />
      </g>
    </svg>
  );
}

function LotusMark({ size, color, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={style} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.2" opacity="0.55" strokeLinecap="round">
        <path d="M16 26 Q 6 20 6 12 Q 10 18 16 20" />
        <path d="M16 26 Q 26 20 26 12 Q 22 18 16 20" />
        <path d="M16 26 L 16 16 Q 10 14 10 8 Q 16 12 16 18" />
        <path d="M16 16 Q 22 14 22 8 Q 16 12 16 18" />
      </g>
    </svg>
  );
}

function Decor({ type, color, scale }) {
  if (type === 'snowflakes') {
    const sz = 22 * scale;
    return (
      <>
        <Snowflake size={sz} color={color} style={{ position: 'absolute', top: 10 * scale, left: 12 * scale }} />
        <Snowflake size={sz * 0.7} color={color} style={{ position: 'absolute', top: 16 * scale, right: 14 * scale }} />
        <Snowflake size={sz * 0.8} color={color} style={{ position: 'absolute', bottom: 14 * scale, left: 18 * scale }} />
      </>
    );
  }
  if (type === 'sakura') {
    return (
      <SakuraBranch
        width={140 * scale}
        color={color}
        style={{ position: 'absolute', top: -6 * scale, right: -12 * scale, transform: 'rotate(6deg)' }}
      />
    );
  }
  if (type === 'thai') {
    return <ThaiOrnamentBorder color={color} />;
  }
  if (type === 'minimal') {
    return <LotusMark size={28 * scale} color={color} style={{ position: 'absolute', bottom: 10 * scale, left: 12 * scale }} />;
  }
  return null;
}

export default function GiftCertificate({
  design = 'light',
  amount = 0,
  recipientName = '',
  senderName = '',
  code = 'SH-PREVIEW',
  validUntil,
  width = 320,
}) {
  const { t } = useTranslation();
  const cfg = getDesignConfig(design);
  const scale = width / 320;
  const height = width / 1.6;

  const padX = 20 * scale;
  const padY = 16 * scale;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: 18 * scale,
        overflow: 'hidden',
        background: cfg.background,
        color: cfg.text,
        boxShadow: `0 12px 30px -12px ${colors.warmDark}59`,
        fontFamily: FONT_FAMILY,
        flexShrink: 0,
      }}
    >
      <Decor type={cfg.decor} color={cfg.accent} scale={scale} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: `${padY}px ${padX}px`,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={cfg.logo}
            alt="SHANTI"
            style={{
              height: 24 * scale,
              width: 'auto',
              objectFit: 'contain',
              filter: LOGO_SHADOW_DESIGNS.has(design)
                ? `drop-shadow(0 1px 2px ${colors.warmDark}40)`
                : undefined,
            }}
          />
        </div>

        <div style={{ marginTop: 6 * scale, textAlign: 'center' }}>
          <div
            style={{
              fontSize: 8 * scale,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: cfg.textMuted,
              fontWeight: 700,
            }}
          >
            {t('gift.certificate_title')}
          </div>
          <div
            style={{
              ...FONT_DISPLAY,
              fontSize: 34 * scale,
              lineHeight: 1.05,
              marginTop: 3 * scale,
              letterSpacing: '-0.02em',
            }}
          >
            {formatAmount(amount)}
          </div>
        </div>

        {(recipientName || senderName) && (
          <div
            style={{
              marginTop: 6 * scale,
              textAlign: 'center',
              fontSize: 9 * scale,
              lineHeight: 1.45,
              color: cfg.textMuted,
            }}
          >
            {recipientName && (
              <div>
                <span style={{ opacity: 0.7 }}>{t('gift.for_recipient')}: </span>
                <span style={{ color: cfg.text }}>{recipientName}</span>
              </div>
            )}
            {senderName && (
              <div>
                <span style={{ opacity: 0.7 }}>{t('gift.from_sender')}: </span>
                <span style={{ color: cfg.text }}>{senderName}</span>
              </div>
            )}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 8 * scale,
          }}
        >
          <div style={{ fontSize: 7.5 * scale, color: cfg.textMuted, lineHeight: 1.5 }}>
            <div>
              {t('gift.valid_until')}: <span style={{ color: cfg.text }}>{formatDate(validUntil)}</span>
            </div>
            <div style={{ marginTop: 3 * scale, opacity: 0.85 }}>Сатпаева 50/1 · Нурмагамбетова 4</div>
            <div style={{ opacity: 0.7 }}>@shanti_thai_spa_ukg</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 * scale }}>
            <div
              style={{
                padding: 3 * scale,
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 5 * scale,
                lineHeight: 0,
              }}
            >
              <QRCodeSVG
                value={`shanti://cert/${code}`}
                size={Math.round(42 * scale)}
                bgColor="transparent"
                fgColor={cfg.text}
                level="M"
              />
            </div>
            <div
              style={{
                fontSize: 6.5 * scale,
                letterSpacing: '0.08em',
                color: cfg.textMuted,
                fontFamily: FONT_FAMILY,
              }}
            >
              {code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
