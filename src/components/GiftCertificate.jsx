import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '../hooks/useTranslation.js';
import { colors } from '../theme/colors.js';
import { FONT_FAMILY } from '../theme/fonts.js';

const DESIGN_CONFIG = {
  newyear: {
    src: '/assets/certificates/cert-newyear-v2.jpg',
    tone: 'dark',
    primary: '#C9A961',
    muted: '#9A8454',
    border: '#C9A961',
    logo: '/assets/logo/shanti-logo-on-dark.png',
    label: 'Новый год',
    emoji: '🎄',
    startX: 28,
    contactsFontSize: 9,
    frame: false,
  },
  '8march': {
    src: '/assets/certificates/cert-8march-v2.jpg',
    tone: 'light',
    primary: '#B8794A',
    muted: '#967056',
    border: '#B8794A',
    logo: '/assets/logo/shanti-logo-on-light.png',
    label: '8 марта',
    emoji: '🌷',
    startX: 28,
    contactsFontSize: 9,
    frame: false,
  },
  birthday: {
    src: '/assets/certificates/cert-birthday-v2.jpg',
    tone: 'light',
    primary: '#B8794A',
    muted: '#967056',
    border: '#B8794A',
    logo: '/assets/logo/shanti-logo-on-light.png',
    label: 'День рождения',
    emoji: '🎂',
    startX: 28,
    contactsFontSize: 9,
    frame: false,
  },
  everyday: {
    src: '/assets/certificates/cert-everyday-v2.jpg',
    tone: 'dark',
    primary: '#C9A961',
    muted: '#9A8454',
    border: '#C9A961',
    logo: '/assets/logo/shanti-logo-on-dark.png',
    label: 'Гармония',
    emoji: '✨',
    startX: 80,
    contactsFontSize: 8.5,
    frame: true,
  },
};

export const GIFT_DESIGNS = ['newyear', '8march', 'birthday', 'everyday'];
export const getDesignConfig = (id) => DESIGN_CONFIG[id] || DESIGN_CONFIG.everyday;

const QR_CREAM = '#FBF8F1';

function formatAmount(v) {
  if (v == null) return '';
  return Number(v).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₸';
}

function formatDate(d) {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function truncateRecipient(name) {
  if (!name) return '';
  return name.length > 18 ? name.slice(0, 17) + '…' : name;
}

export default function GiftCertificate({
  design = 'everyday',
  amount = 0,
  recipientName = '',
  code = 'SH-PREVIEW',
  validUntil,
  width = 320,
}) {
  const { t } = useTranslation();
  const cfg = getDesignConfig(design);
  const scale = width / 320;
  const height = 200 * scale;

  const px = (v) => v * scale;
  const startX = cfg.startX;

  const qrCardX = 240;
  const qrCardY = 126;
  const qrCardSize = 66;
  const qrVisualX = 250;
  const qrVisualY = 132;
  const qrVisualSize = 46;
  const codeStripY = 178;
  const codeStripHeight = 14;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: px(18),
        overflow: 'hidden',
        backgroundImage: `url(${cfg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: `0 12px 30px -12px ${colors.warmDark}59`,
        fontFamily: FONT_FAMILY,
        flexShrink: 0,
      }}
    >
      {cfg.frame && (
        <svg
          width={width}
          height={height}
          viewBox="0 0 320 200"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <rect
            x="5"
            y="5"
            width="310"
            height="190"
            fill="none"
            stroke={cfg.border}
            strokeWidth="1.5"
            opacity="0.85"
          />
          <g fill={cfg.border} opacity="0.85">
            <rect x="2" y="2" width="6" height="6" transform="rotate(45 5 5)" />
            <rect x="312" y="2" width="6" height="6" transform="rotate(45 315 5)" />
            <rect x="2" y="192" width="6" height="6" transform="rotate(45 5 195)" />
            <rect x="312" y="192" width="6" height="6" transform="rotate(45 315 195)" />
          </g>
        </svg>
      )}

      <img
        src={cfg.logo}
        alt="SHANTI"
        style={{
          position: 'absolute',
          left: px(startX),
          top: px(12),
          height: px(20),
          width: 'auto',
          objectFit: 'contain',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: px(startX),
          top: px(44),
          width: px(240 - startX - 8),
          fontSize: px(14),
          fontWeight: 700,
          color: cfg.primary,
          letterSpacing: '0.02em',
          lineHeight: 1.15,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {t('gift.certificate_title_display')}
      </div>

      <div
        style={{
          position: 'absolute',
          left: px(startX),
          top: px(70),
          width: px(240 - startX - 8),
          fontSize: px(28),
          fontWeight: 700,
          color: cfg.primary,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        {formatAmount(amount)}
      </div>

      {recipientName && (
        <div
          style={{
            position: 'absolute',
            left: px(startX),
            top: px(104),
            width: px(240 - startX - 8),
            fontSize: px(13),
            fontWeight: 400,
            color: cfg.primary,
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {truncateRecipient(recipientName)}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: px(startX),
          top: px(173),
          width: px(240 - startX - 8),
          fontSize: px(9),
          color: cfg.muted,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}
      >
        {t('gift.valid_until')}: {formatDate(validUntil)}
      </div>

      <div
        style={{
          position: 'absolute',
          left: px(startX),
          top: px(185),
          width: px(240 - startX - 8),
          fontSize: px(cfg.contactsFontSize),
          color: cfg.muted,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}
      >
        {t('gift.contacts_address')} · {t('gift.contacts_instagram')}
      </div>

      <div
        style={{
          position: 'absolute',
          left: px(qrCardX),
          top: px(qrCardY),
          width: px(qrCardSize),
          height: px(qrCardSize),
          background: QR_CREAM,
          border: `1px solid ${cfg.border}`,
          borderRadius: px(3),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: px(qrVisualX),
          top: px(qrVisualY),
          width: px(qrVisualSize),
          height: px(qrVisualSize),
          lineHeight: 0,
        }}
      >
        <QRCodeSVG
          value={`shanti://cert/${code}`}
          size={Math.round(px(qrVisualSize))}
          bgColor={QR_CREAM}
          fgColor="#2A2019"
          level="M"
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: px(qrCardX + 2),
          top: px(codeStripY),
          width: px(qrCardSize - 4),
          height: px(codeStripHeight),
          fontSize: px(7.5),
          color: cfg.muted,
          textAlign: 'center',
          letterSpacing: '0.04em',
          lineHeight: `${px(codeStripHeight)}px`,
          fontFamily: FONT_FAMILY,
        }}
      >
        {code}
      </div>
    </div>
  );
}
