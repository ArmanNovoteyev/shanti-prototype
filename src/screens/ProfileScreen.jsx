import { useContext, useState } from 'react';
import { ChevronDown, MapPin, Instagram } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { branches, getBranch } from '../data/branches.js';
import { getMaster } from '../data/masters.js';

const tokens = {
  deepSage: '#344237',
  sage: '#4A5D4F',
  copper: '#B8794A',
  copperSoft: 'rgba(184,121,74,0.12)',
  ivory: '#FBF8F1',
  cream: '#F2EDE3',
  muted: '#8A8B86',
  text: '#2A2E28',
};

const display = {
  fontFamily: "'Fraunces', serif",
  fontWeight: 500,
  letterSpacing: '-0.02em',
};

const body = { fontFamily: "'Manrope', sans-serif" };

const cardBase = {
  background: tokens.ivory,
  border: '1px solid rgba(42,46,40,0.06)',
  borderRadius: 20,
  overflow: 'hidden',
};

function formatPhone(raw) {
  const digits = (raw || '').replace(/\D/g, '');
  const rest = digits.startsWith('7') ? digits.slice(1) : digits;
  if (rest.length !== 10) return raw;
  return `+7 (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6, 8)}-${rest.slice(8, 10)}`;
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        ...body,
        fontSize: 11,
        letterSpacing: '0.12em',
        color: tokens.muted,
        fontWeight: 700,
        textTransform: 'uppercase',
        margin: '0 4px 10px',
      }}
    >
      {children}
    </div>
  );
}

function PreferenceRow({ label, value, interactive = true, onClick, isLast }) {
  const style = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderBottom: isLast ? 'none' : '1px solid rgba(42,46,40,0.06)',
    cursor: interactive ? 'pointer' : 'default',
    textAlign: 'left',
    fontFamily: body.fontFamily,
  };
  const content = (
    <>
      <span style={{ fontSize: 14, color: tokens.text, fontWeight: 500 }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        <span
          style={{
            fontSize: 14,
            color: tokens.muted,
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </span>
        {interactive && <ChevronDown size={16} color={tokens.muted} />}
      </span>
    </>
  );
  if (!interactive) {
    return <div style={style}>{content}</div>;
  }
  return (
    <button type="button" onClick={onClick} style={style}>
      {content}
    </button>
  );
}

function Switch({ on, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 999,
        background: on ? tokens.deepSage : '#D4CFC4',
        border: 'none',
        padding: 3,
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s ease',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: 'block',
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          transform: on ? 'translateX(18px)' : 'translateX(0)',
          transition: 'transform 0.2s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  );
}

function ToggleRow({ label, on, onChange, isLast }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : '1px solid rgba(42,46,40,0.06)',
      }}
    >
      <span style={{ ...body, fontSize: 14, color: tokens.text, fontWeight: 500 }}>{label}</span>
      <Switch on={on} onChange={onChange} />
    </div>
  );
}

function BranchRow({ branch, localized, isLast }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : '1px solid rgba(42,46,40,0.06)',
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: tokens.copperSoft,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        <MapPin size={14} color={tokens.copper} />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <div style={{ ...body, fontSize: 14, color: tokens.text, fontWeight: 600 }}>
          {localized(branch, 'name')}
        </div>
        <div style={{ ...body, fontSize: 13, color: tokens.muted, lineHeight: 1.4 }}>
          {localized(branch, 'address')}
        </div>
        <a
          href={`tel:${branch.phone}`}
          style={{
            ...body,
            fontSize: 13,
            color: tokens.copper,
            fontWeight: 600,
            textDecoration: 'none',
            marginTop: 2,
          }}
        >
          {branch.phone_display}
        </a>
      </div>
    </div>
  );
}

function InstagramRow({ handle, isLast }) {
  return (
    <a
      href="https://instagram.com/shanti_thai_spa_ukg"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        textDecoration: 'none',
        borderBottom: isLast ? 'none' : '1px solid rgba(42,46,40,0.06)',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: tokens.copperSoft,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Instagram size={14} color={tokens.copper} />
      </span>
      <span style={{ ...body, fontSize: 14, color: tokens.copper, fontWeight: 600 }}>
        {handle}
      </span>
    </a>
  );
}

export default function ProfileScreen() {
  const { t, lang, setLang, localized } = useTranslation();
  const { user, showToast } = useContext(AppContext);

  const [pushOn, setPushOn] = useState(true);
  const [emailOn, setEmailOn] = useState(false);
  const [smsOn, setSmsOn] = useState(true);

  const favBranch = getBranch(user.favorite_branch);
  const favMaster = getMaster(user.favorite_master);
  const avatarLetter = (user.name || '?').trim().charAt(0).toUpperCase();

  const langOptions = [
    { code: 'ru', label: t('profile.language_ru') },
    { code: 'kk', label: t('profile.language_kk') },
    { code: 'en', label: t('profile.language_en') },
  ];

  return (
    <div style={{ padding: '20px 16px 32px', background: tokens.ivory, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #B8794A 0%, #8E5B36 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(184,121,74,0.18)',
          }}
        >
          <span style={{ ...display, fontSize: 32, color: '#fff' }}>{avatarLetter}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <div style={{ ...display, fontSize: 24, color: tokens.deepSage }}>{user.name}</div>
          <div style={{ ...body, fontSize: 13, color: tokens.muted }}>
            {formatPhone(user.phone)}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div style={{ marginBottom: 22 }}>
        <SectionTitle>{t('profile.preferences_title')}</SectionTitle>
        <div style={cardBase}>
          <PreferenceRow
            label={t('profile.favorite_branch')}
            value={localized(favBranch, 'name')}
            onClick={() => showToast(t('profile.pref_toast_soon'))}
          />
          <PreferenceRow
            label={t('profile.favorite_master')}
            value={localized(favMaster, 'name')}
            onClick={() => showToast(t('profile.pref_toast_soon'))}
          />
          <PreferenceRow
            label={t('profile.birthday')}
            value={t('profile.birthday_value')}
            interactive={false}
            isLast
          />
        </div>
      </div>

      {/* Language */}
      <div style={{ marginBottom: 22 }}>
        <SectionTitle>{t('profile.language_title')}</SectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          {langOptions.map(({ code, label }) => {
            const active = lang === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                style={{
                  ...body,
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 14,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: active ? tokens.copper : tokens.ivory,
                  color: active ? tokens.ivory : tokens.text,
                  border: active
                    ? '1px solid transparent'
                    : '1px solid rgba(184,121,74,0.35)',
                  transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      <div style={{ marginBottom: 22 }}>
        <SectionTitle>{t('profile.notifications_title')}</SectionTitle>
        <div style={cardBase}>
          <ToggleRow label={t('profile.notifications_push')} on={pushOn} onChange={setPushOn} />
          <ToggleRow
            label={t('profile.notifications_email')}
            on={emailOn}
            onChange={setEmailOn}
          />
          <ToggleRow
            label={t('profile.notifications_sms')}
            on={smsOn}
            onChange={setSmsOn}
            isLast
          />
        </div>
      </div>

      {/* About */}
      <div style={{ marginBottom: 22 }}>
        <SectionTitle>{t('profile.about_title')}</SectionTitle>
        <div style={cardBase}>
          {branches.map((br, idx) => (
            <BranchRow
              key={br.id}
              branch={br}
              localized={localized}
              isLast={false}
              _idx={idx}
            />
          ))}
          <InstagramRow handle={t('profile.instagram_handle')} isLast />
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={() => showToast(t('profile.logout_toast'))}
        style={{
          ...body,
          width: '100%',
          background: 'transparent',
          border: '1px solid rgba(42,46,40,0.12)',
          color: tokens.muted,
          padding: 14,
          borderRadius: 18,
          fontSize: 14,
          fontWeight: 600,
          marginTop: 8,
          cursor: 'pointer',
        }}
      >
        {t('profile.logout')}
      </button>
    </div>
  );
}
