import { useContext, useMemo, useState } from 'react';
import { ChevronLeft, Camera, Check, ChevronDown, PlayCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { branches } from '../data/branches.js';
import { masters } from '../data/masters.js';
import { colors } from '../theme/colors.js';
import { FONT_DISPLAY } from '../theme/fonts.js';
import SubscriptionBalanceCard from '../components/SubscriptionBalanceCard.jsx';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.01em' };

const body = { fontFamily: "'Manrope', sans-serif" };

const CHEVRON_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239A8B7A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

function pluralizeRu(n) {
  const mod100 = Math.abs(n) % 100;
  const mod10 = Math.abs(n) % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'many';
  if (mod10 === 1) return 'one';
  if (mod10 >= 2 && mod10 <= 4) return 'few';
  return 'many';
}

function SectionTitle({ children, first }) {
  return (
    <h2
      style={{
        ...display,
        fontSize: 22,
        color: colors.deepBrown,
        margin: first ? '0 0 8px' : '28px 0 8px',
      }}
    >
      {children}
    </h2>
  );
}

function CounterLine({ remaining, t }) {
  if (remaining === 0) {
    return (
      <div style={{ ...body, fontSize: 13, color: colors.success, margin: '0 0 18px' }}>
        {t('profile.counter_all_done')}
      </div>
    );
  }
  const key = `profile.counter_remaining_${pluralizeRu(remaining)}`;
  return (
    <div style={{ ...body, fontSize: 13, color: colors.textMuted, margin: '0 0 18px' }}>
      {t(key, { n: remaining })}
    </div>
  );
}

function UnderlineField({
  label,
  value,
  onChange,
  required,
  type = 'text',
  placeholder,
  inputMode,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== '' && value != null;
  const floating = focused || hasValue || type === 'date';

  return (
    <div style={{ position: 'relative', paddingTop: 22, paddingBottom: 10 }}>
      {required && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 30,
            color: colors.copper,
            ...body,
            fontSize: 15,
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          *
        </span>
      )}
      <label
        style={{
          position: 'absolute',
          left: required ? 14 : 0,
          top: floating ? 0 : 30,
          fontSize: floating ? 11 : 15,
          color: focused ? colors.copper : colors.textMuted,
          ...body,
          fontWeight: floating ? 600 : 400,
          letterSpacing: floating ? '0.08em' : 0,
          textTransform: floating ? 'uppercase' : 'none',
          transition: 'top 0.18s, font-size 0.18s, color 0.18s',
          pointerEvents: 'none',
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value || ''}
        placeholder={floating ? placeholder || '' : ''}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          border: 'none',
          borderBottom: `1px solid ${focused ? colors.copper : 'rgba(42,32,25,0.18)'}`,
          paddingLeft: required ? 14 : 0,
          paddingRight: 0,
          paddingTop: 4,
          paddingBottom: 8,
          background: 'transparent',
          fontSize: 15,
          ...body,
          color: colors.textMain,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function UnderlineSelect({ label, value, onChange, options, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', paddingTop: 22, paddingBottom: 10 }}>
      {required && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 30,
            color: colors.copper,
            ...body,
            fontSize: 15,
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          *
        </span>
      )}
      <label
        style={{
          position: 'absolute',
          left: required ? 14 : 0,
          top: 0,
          fontSize: 11,
          color: focused ? colors.copper : colors.textMuted,
          ...body,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          border: 'none',
          borderBottom: `1px solid ${focused ? colors.copper : 'rgba(42,32,25,0.18)'}`,
          paddingLeft: required ? 14 : 0,
          paddingRight: 24,
          paddingTop: 4,
          paddingBottom: 8,
          background: 'transparent',
          backgroundImage: CHEVRON_SVG,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: '16px 16px',
          fontSize: 15,
          ...body,
          color: colors.textMain,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function RadioRow({ options, value, onChange, label }) {
  return (
    <div style={{ padding: '16px 0 6px' }}>
      {label && (
        <div
          style={{
            ...body,
            fontSize: 11,
            color: colors.textMuted,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                ...body,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  border: `1.5px solid ${active ? colors.copper : colors.textSoft}`,
                  background: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  transition: 'border-color 0.15s',
                  flexShrink: 0,
                }}
              >
                {active && (
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      background: colors.copper,
                    }}
                  />
                )}
              </span>
              <span style={{ fontSize: 14, color: colors.textMain, fontWeight: 500 }}>
                {o.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhoneRow({ value, onChange, country, onCountryChange, countryLabel, label }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', paddingTop: 22, paddingBottom: 10 }}>
      <label
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          fontSize: 11,
          color: focused ? colors.copper : colors.textMuted,
          ...body,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          borderBottom: `1px solid ${focused ? colors.copper : 'rgba(42,32,25,0.18)'}`,
          paddingBottom: 8,
          paddingTop: 4,
        }}
      >
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            border: 'none',
            background: 'transparent',
            backgroundImage: CHEVRON_SVG,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
            backgroundSize: '14px 14px',
            paddingRight: 20,
            fontSize: 15,
            ...body,
            color: colors.textMain,
            outline: 'none',
            minWidth: 40,
          }}
        >
          <option value="+7">{countryLabel}</option>
        </select>
        <input
          type="tel"
          inputMode="tel"
          value={value}
          placeholder="705 500 50 20"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontSize: 15,
            ...body,
            color: colors.textMain,
            outline: 'none',
            padding: 0,
          }}
        />
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        background: 'none',
        border: 'none',
        padding: '16px 0',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          flexShrink: 0,
          borderRadius: 4,
          border: `1.5px solid ${checked ? colors.copper : colors.textSoft}`,
          background: checked ? colors.copper : 'transparent',
          display: 'grid',
          placeItems: 'center',
          marginTop: 1,
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </span>
      <span style={{ ...body, fontSize: 13, color: colors.textMuted, lineHeight: 1.45 }}>
        {label}
      </span>
    </button>
  );
}

function ConfirmModal({ title, text, yesLabel, noLabel, onYes, onNo }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(42,32,25,0.5)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        zIndex: 80,
      }}
      onClick={onNo}
    >
      <div
        role="dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.ivory,
          borderRadius: 22,
          padding: '22px 22px 20px',
          width: '100%',
          maxWidth: 340,
          boxShadow: '0 18px 40px -12px rgba(42,32,25,0.45)',
        }}
      >
        <div
          style={{
            ...display,
            fontSize: 22,
            color: colors.deepBrown,
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div style={{ ...body, fontSize: 14, color: colors.textMuted, lineHeight: 1.45 }}>
          {text}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            type="button"
            onClick={onNo}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid rgba(42,32,25,0.2)',
              color: colors.textMain,
              padding: '12px 14px',
              borderRadius: 14,
              ...body,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {noLabel}
          </button>
          <button
            type="button"
            onClick={onYes}
            style={{
              flex: 1,
              background: colors.danger,
              border: 'none',
              color: '#fff',
              padding: '12px 14px',
              borderRadius: 14,
              ...body,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {yesLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileScreen() {
  const { t, lang, setLang, localized } = useTranslation();
  const { user, navigate, showToast, userSubscriptions, resetOnboarding } = useContext(AppContext);

  const [form, setForm] = useState(() => ({
    lastName: '',
    firstName: user.name || 'Айгерим',
    middleName: '',
    gender: 'female',
    birthDate: '1985-08-14',
    phoneCountry: '+7',
    phone: '777 123 45 67',
    email: 'aigerim@mail.com',
    favoriteBranch: user.favorite_branch || branches[0].id,
    favoriteMaster: user.favorite_master || masters[0].id,
    marketingConsent: false,
  }));
  const [deleteOpen, setDeleteOpen] = useState(false);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const requiredKeys = ['lastName', 'firstName', 'birthDate', 'gender', 'email'];
  const remaining = useMemo(
    () =>
      requiredKeys.reduce((acc, k) => {
        const v = form[k];
        return acc + (v === '' || v == null ? 1 : 0);
      }, 0),
    [form],
  );

  const branchOptions = useMemo(
    () => branches.map((b) => ({ value: b.id, label: localized(b, 'name') })),
    [localized, lang],
  );
  const masterOptions = useMemo(
    () =>
      masters.map((m) => {
        const branch = branches.find((b) => b.id === m.branch);
        const branchName = branch ? localized(branch, 'name') : '';
        return {
          value: m.id,
          label: branchName ? `${localized(m, 'name')} (${branchName})` : localized(m, 'name'),
        };
      }),
    [localized, lang],
  );

  const avatarLetter = (form.firstName || user.name || '?').trim().charAt(0).toUpperCase();

  const handleSave = () => showToast(t('profile.save_toast'));
  const handleDelete = () => {
    setDeleteOpen(false);
    showToast(t('profile.delete_toast'));
  };

  return (
    <div
      style={{
        padding: '4px 20px 40px',
        background: colors.ivory,
        minHeight: '100%',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0 16px' }}>
        <button
          type="button"
          onClick={() => navigate('home')}
          aria-label={t('common.back')}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            background: 'transparent',
            border: 'none',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            marginLeft: -8,
          }}
        >
          <ChevronLeft size={22} color={colors.deepBrown} />
        </button>
        <span
          style={{
            ...body,
            fontSize: 15,
            color: colors.textMain,
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          {t('profile.screen_title')}
        </span>
      </div>

      {/* Avatar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 28,
          marginTop: 4,
        }}
      >
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.copper} 0%, ${colors.copperDark} 100%)`,
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 6px 16px rgba(184,121,74,0.24)',
            }}
          >
            <span style={{ ...display, fontSize: 36, color: '#fff' }}>{avatarLetter}</span>
          </div>
          <button
            type="button"
            aria-label={t('profile.change_photo_label')}
            onClick={() => showToast(t('profile.pref_toast_soon'))}
            style={{
              position: 'absolute',
              right: -2,
              bottom: -2,
              width: 26,
              height: 26,
              borderRadius: 13,
              background: colors.warmDark,
              border: `2px solid ${colors.ivory}`,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Camera size={12} color="#fff" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Personal info */}
      <SectionTitle first>{t('profile.section_personal')}</SectionTitle>
      <CounterLine remaining={remaining} t={t} />

      <UnderlineField
        label={t('profile.field_last_name')}
        value={form.lastName}
        onChange={(v) => setField('lastName', v)}
        required
      />
      <UnderlineField
        label={t('profile.field_first_name')}
        value={form.firstName}
        onChange={(v) => setField('firstName', v)}
        required
      />
      <UnderlineField
        label={t('profile.field_middle_name')}
        value={form.middleName}
        onChange={(v) => setField('middleName', v)}
      />

      <RadioRow
        label={t('profile.field_gender_label')}
        options={[
          { value: 'female', label: t('profile.field_gender_female') },
          { value: 'male', label: t('profile.field_gender_male') },
        ]}
        value={form.gender}
        onChange={(v) => setField('gender', v)}
      />

      {/* Date of birth */}
      <SectionTitle>{t('profile.section_dob')}</SectionTitle>
      <UnderlineField
        label={t('profile.field_birth_date_label')}
        value={form.birthDate}
        onChange={(v) => setField('birthDate', v)}
        type="date"
        required
      />

      {/* Contacts */}
      <SectionTitle>{t('profile.section_contacts')}</SectionTitle>
      <PhoneRow
        label={t('profile.field_phone_label')}
        value={form.phone}
        onChange={(v) => setField('phone', v)}
        country={form.phoneCountry}
        onCountryChange={(v) => setField('phoneCountry', v)}
        countryLabel={form.phoneCountry}
      />
      <UnderlineField
        label={t('profile.field_email_label')}
        value={form.email}
        onChange={(v) => setField('email', v)}
        type="email"
        required
        placeholder="name@mail.com"
        inputMode="email"
      />

      {/* Preferences */}
      <SectionTitle>{t('profile.section_preferences')}</SectionTitle>
      <UnderlineSelect
        label={t('profile.favorite_branch')}
        value={form.favoriteBranch}
        onChange={(v) => setField('favoriteBranch', v)}
        options={branchOptions}
      />
      <UnderlineSelect
        label={t('profile.favorite_master')}
        value={form.favoriteMaster}
        onChange={(v) => setField('favoriteMaster', v)}
        options={masterOptions}
      />

      {/* My subscriptions */}
      {userSubscriptions && userSubscriptions.length > 0 && (
        <>
          <SectionTitle>{t('subscriptions.my_subscriptions')}</SectionTitle>
          <div style={{ display: 'grid', gap: 10, marginTop: 4 }}>
            {userSubscriptions.map((s) => (
              <SubscriptionBalanceCard key={s.id} userSub={s} />
            ))}
          </div>
        </>
      )}

      {/* Marketing consent */}
      <div style={{ marginTop: 12 }}>
        <Checkbox
          checked={form.marketingConsent}
          onChange={(v) => setField('marketingConsent', v)}
          label={t('profile.marketing_consent')}
        />
      </div>

      {/* Language */}
      <SectionTitle>{t('profile.section_language')}</SectionTitle>
      <RadioRow
        options={[
          { value: 'ru', label: t('profile.language_ru') },
          { value: 'kk', label: t('profile.language_kk') },
          { value: 'en', label: t('profile.language_en') },
        ]}
        value={lang}
        onChange={setLang}
      />

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        style={{
          ...body,
          marginTop: 32,
          width: '100%',
          height: 54,
          background: colors.copper,
          color: colors.ivory,
          border: 'none',
          borderRadius: 16,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 14px 28px -14px rgba(184,121,74,0.7)',
        }}
      >
        {t('profile.save')}
      </button>

      {/* Delete account */}
      <button
        type="button"
        onClick={() => setDeleteOpen(true)}
        style={{
          ...body,
          marginTop: 12,
          width: '100%',
          height: 52,
          background: 'transparent',
          color: colors.danger,
          border: `1px solid ${colors.danger}`,
          borderRadius: 16,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        {t('profile.delete_account')}
      </button>

      {/* Show tour link */}
      <button
        type="button"
        onClick={resetOnboarding}
        style={{
          ...body,
          marginTop: 18,
          width: '100%',
          background: 'transparent',
          color: colors.copper,
          border: 'none',
          padding: '8px 0',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <PlayCircle size={16} color={colors.copper} strokeWidth={2} />
        {t('profile.show_tour')}
      </button>

      {deleteOpen && (
        <ConfirmModal
          title={t('profile.delete_confirm_title')}
          text={t('profile.delete_confirm_text')}
          yesLabel={t('profile.delete_confirm_yes')}
          noLabel={t('profile.delete_confirm_no')}
          onYes={handleDelete}
          onNo={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}
