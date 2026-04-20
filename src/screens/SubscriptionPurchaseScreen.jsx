import { useContext, useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  Wallet,
  Sparkles,
  Heart,
  CreditCard,
  Check,
  Clock,
  Users,
  CalendarClock,
  Plus,
  Trash2,
} from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { getSubscription, formatPrice, SUBSCRIPTION_METAL_COLORS } from '../data/subscriptions.js';
import { colors } from '../theme/colors.js';
import { FONT_DISPLAY, FONT_BODY } from '../theme/fonts.js';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.02em' };
const body = { ...FONT_BODY };

function phoneDigits(str) {
  const raw = (str || '').replace(/\D/g, '');
  if (raw.length === 0) return '';
  const head = raw[0] === '8' ? '7' + raw.slice(1) : raw[0] === '7' ? raw : '7' + raw;
  return head.slice(0, 11);
}

function formatPhoneMask(digits) {
  if (!digits) return '';
  const rest = digits.startsWith('7') ? digits.slice(1) : digits;
  if (rest.length === 0) return '+7';
  let out = '+7 (' + rest.slice(0, 3);
  if (rest.length >= 3) out += ')';
  if (rest.length > 3) out += ' ' + rest.slice(3, 6);
  if (rest.length > 6) out += '-' + rest.slice(6, 8);
  if (rest.length > 8) out += '-' + rest.slice(8, 10);
  return out;
}

function isPhoneValid(digits) {
  return (digits || '').replace(/\D/g, '').length === 11;
}

function formatDateRu(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...body,
        background: colors.cream,
        border: 'none',
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      aria-label="back"
    >
      <ChevronLeft size={18} color={colors.deepBrown} />
    </button>
  );
}

function PrimaryButton({ children, onClick, disabled, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...body,
        width: '100%',
        background: disabled ? colors.cream : colors.copper,
        color: disabled ? colors.textMuted : colors.ivory,
        border: 'none',
        padding: '17px',
        borderRadius: 20,
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 10px 24px -10px rgba(184,121,74,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      {Icon && <Icon size={18} strokeWidth={2} />}
      <span>{children}</span>
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...body,
        width: '100%',
        background: 'transparent',
        border: 'none',
        color: colors.textMuted,
        padding: '12px',
        fontSize: 14,
        cursor: 'pointer',
        marginTop: 4,
      }}
    >
      {children}
    </button>
  );
}

function StepShell({ title, subtitle, onBack, children, footer }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ padding: '4px 24px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ ...display, fontSize: 22, color: colors.deepBrown, lineHeight: 1.15 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ ...body, color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '0 24px', flex: 1 }}>{children}</div>
      {footer && <div style={{ padding: '20px 24px 0' }}>{footer}</div>}
    </div>
  );
}

function TariffSummaryCard({ sub, t, localized }) {
  const metalColor = SUBSCRIPTION_METAL_COLORS[sub.color] || colors.copper;
  return (
    <div
      style={{
        background: colors.deepBrown,
        color: colors.ivory,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 10,
        }}
      >
        <div style={{ ...display, fontSize: 26, color: metalColor }}>
          {localized(sub, 'name')}
        </div>
        <div style={{ ...body, fontSize: 13, color: 'rgba(240,230,217,0.75)' }}>
          {localized(sub, 'tagline')}
        </div>
      </div>
      <div style={{ height: 1, background: 'rgba(240,230,217,0.12)', margin: '8px 0 14px' }} />
      <Row icon={Clock} label={t('subscriptions.hours_of_procedures', { n: sub.hours })} />
      <Row
        icon={Users}
        label={
          sub.guests > 0
            ? t('subscriptions.for_n_persons_plus_guests', { n: sub.holders, g: sub.guests })
            : t('subscriptions.for_n_persons', { n: sub.holders })
        }
      />
      <Row
        icon={CalendarClock}
        label={`${t('subscriptions.validity_short')}: ${sub.durationMonths} ${t('subscriptions.months_short')}`}
      />
      <div style={{ height: 1, background: 'rgba(240,230,217,0.12)', margin: '14px 0' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span style={{ ...body, fontSize: 13, color: 'rgba(240,230,217,0.75)' }}>
          {t('subscriptions.total')}
        </span>
        <span style={{ ...display, fontSize: 24 }}>{formatPrice(sub.price)}</span>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
      <Icon size={16} color="rgba(240,230,217,0.75)" />
      <span style={{ ...body, fontSize: 14 }}>{label}</span>
    </div>
  );
}

function IntroStep({ sub, t, localized, onNext, onBack }) {
  const steps = [
    { Icon: Wallet, titleKey: 'intro_step_1_title', textKey: 'intro_step_1_text' },
    { Icon: Sparkles, titleKey: 'intro_step_2_title', textKey: 'intro_step_2_text' },
    { Icon: Heart, titleKey: 'intro_step_3_title', textKey: 'intro_step_3_text' },
  ];
  return (
    <StepShell
      title={localized(sub, 'name')}
      subtitle={localized(sub, 'tagline')}
      onBack={onBack}
      footer={<PrimaryButton onClick={onNext}>{t('common.continue')}</PrimaryButton>}
    >
      <div
        style={{
          ...body,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: colors.textMuted,
          textTransform: 'uppercase',
          marginBottom: 14,
        }}
      >
        {t('subscriptions.purchase.intro_title')}
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {steps.map((s, i) => {
          const Icon = s.Icon;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                background: colors.ivory,
                border: '1px solid rgba(42,32,25,0.06)',
                borderRadius: 16,
                padding: '14px 16px',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: colors.copperSoft,
                  color: colors.copper,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} strokeWidth={2} />
              </div>
              <div>
                <div
                  style={{
                    ...body,
                    fontSize: 14,
                    fontWeight: 700,
                    color: colors.textMain,
                    marginBottom: 3,
                  }}
                >
                  {t(`subscriptions.purchase.${s.titleKey}`)}
                </div>
                <div style={{ ...body, fontSize: 13, color: colors.textMuted, lineHeight: 1.4 }}>
                  {t(`subscriptions.purchase.${s.textKey}`)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}

function TextField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div
        style={{
          ...body,
          fontSize: 11,
          fontWeight: 700,
          color: colors.textMuted,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...body,
          width: '100%',
          padding: '13px 14px',
          border: '1px solid rgba(42,32,25,0.14)',
          borderRadius: 14,
          background: colors.ivory,
          fontSize: 15,
          color: colors.textMain,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </label>
  );
}

function HolderFields({ holder, onChange, onRemove, indexLabel, t }) {
  return (
    <div
      style={{
        background: colors.ivory,
        border: '1px solid rgba(42,32,25,0.08)',
        borderRadius: 16,
        padding: '14px 16px',
        marginBottom: 10,
        position: 'relative',
      }}
    >
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'transparent',
            border: 'none',
            color: colors.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          aria-label="remove"
        >
          <Trash2 size={14} />
        </button>
      )}
      <div
        style={{
          ...body,
          fontSize: 11,
          fontWeight: 700,
          color: colors.textMuted,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        {indexLabel}
      </div>
      <TextField
        label={t('subscriptions.purchase.holder_name')}
        value={holder.name}
        onChange={(v) => onChange({ ...holder, name: v })}
        placeholder="Айгерим"
      />
      <TextField
        label={t('subscriptions.purchase.holder_phone')}
        value={holder.phone}
        onChange={(v) => onChange({ ...holder, phone: formatPhoneMask(phoneDigits(v)) })}
        placeholder="+7 (___) ___-__-__"
      />
    </div>
  );
}

function HolderStep({ sub, t, localized, user, holders, setHolders, onNext, onBack }) {
  const maxHolders = sub.holders;
  const canAddMore = holders.length < maxHolders;

  const addHolder = () =>
    setHolders([...holders, { name: '', phone: '' }]);
  const removeHolder = (idx) =>
    setHolders(holders.filter((_, i) => i !== idx));
  const updateHolder = (idx, next) =>
    setHolders(holders.map((h, i) => (i === idx ? next : h)));

  const primaryValid = isPhoneValid(holders[0]?.phone);
  const extrasValid = holders.slice(1).every((h) => isPhoneValid(h.phone));
  const canContinue = primaryValid && extrasValid;

  return (
    <StepShell
      title={t('subscriptions.purchase.holder_title')}
      subtitle={localized(sub, 'name')}
      onBack={onBack}
      footer={
        <PrimaryButton onClick={onNext} disabled={!canContinue}>
          {t('common.continue')}
        </PrimaryButton>
      }
    >
      {holders.map((h, idx) => (
        <HolderFields
          key={idx}
          holder={h}
          indexLabel={
            idx === 0
              ? t('subscriptions.purchase.holder_primary_label')
              : t('subscriptions.purchase.holder_extra_label', { n: idx + 1 })
          }
          onChange={(next) => updateHolder(idx, next)}
          onRemove={idx === 0 ? null : () => removeHolder(idx)}
          t={t}
        />
      ))}
      {canAddMore && (
        <button
          type="button"
          onClick={addHolder}
          style={{
            ...body,
            width: '100%',
            background: 'transparent',
            border: `1.5px dashed ${colors.copper}`,
            color: colors.copper,
            padding: '14px',
            borderRadius: 16,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Plus size={16} />
          {t('subscriptions.purchase.holder_add_more')}
        </button>
      )}
    </StepShell>
  );
}

function PaymentStep({ sub, t, localized, method, setMethod, onPay, onBack }) {
  const options = [
    { id: 'kaspi', Icon: Wallet, label: t('subscriptions.purchase.payment_kaspi'), color: '#E41B1B' },
    { id: 'card', Icon: CreditCard, label: t('subscriptions.purchase.payment_card'), color: colors.deepBrown },
  ];
  return (
    <StepShell
      title={t('subscriptions.purchase.payment_title')}
      onBack={onBack}
      footer={
        <PrimaryButton onClick={onPay} disabled={!method}>
          {t('subscriptions.purchase.pay_cta', { price: formatPrice(sub.price) })}
        </PrimaryButton>
      }
    >
      <TariffSummaryCard sub={sub} t={t} localized={localized} />
      <div style={{ display: 'grid', gap: 10 }}>
        {options.map((o) => {
          const active = method === o.id;
          const Icon = o.Icon;
          return (
            <button
              type="button"
              key={o.id}
              onClick={() => setMethod(o.id)}
              style={{
                ...body,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 16,
                background: colors.ivory,
                border: active ? `2px solid ${colors.copper}` : '1px solid rgba(42,32,25,0.08)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: o.color,
                  color: colors.ivory,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, fontSize: 14, color: colors.textMain }}>
                {o.label}
              </div>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: `2px solid ${active ? colors.copper : 'rgba(42,32,25,0.24)'}`,
                  background: active ? colors.copper : 'transparent',
                }}
              />
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function ProcessingStep({ t }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 440,
        gap: 20,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          border: `3px solid ${colors.copperSoft}`,
          borderTopColor: colors.copper,
          borderRadius: '50%',
          animation: 'shanti-spin 0.9s linear infinite',
        }}
      />
      <div style={{ ...body, fontSize: 14, color: colors.textMuted }}>
        {t('subscriptions.purchase.processing')}
      </div>
      <style>{`@keyframes shanti-spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

function SuccessStep({ sub, result, t, localized, onToProfile, onToHome }) {
  const metalColor = SUBSCRIPTION_METAL_COLORS[sub.color] || colors.copper;
  return (
    <div style={{ padding: '8px 24px 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: colors.copper,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 14px 28px -12px rgba(184,121,74,0.55)',
          }}
        >
          <Check size={36} color={colors.ivory} strokeWidth={2.4} />
        </div>
      </div>
      <div
        style={{
          ...display,
          fontSize: 22,
          color: colors.deepBrown,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {t('subscriptions.purchase.success_title', { name: localized(sub, 'name') })}
      </div>

      <div
        style={{
          background: colors.cream,
          border: `2px solid ${colors.copper}`,
          borderRadius: 20,
          padding: 18,
          display: 'grid',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ ...body, fontSize: 12, color: colors.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {t('subscriptions.purchase.code_label')}
          </span>
          <span style={{ ...display, fontSize: 18, color: colors.copper, letterSpacing: '0.04em' }}>
            {result?.code}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ ...body, fontSize: 12, color: colors.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {t('subscriptions.purchase.balance_label')}
          </span>
          <span style={{ ...display, fontSize: 18, color: colors.textMain }}>
            {t('subscriptions.hours_of_procedures', { n: result?.hoursTotal })}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ ...body, fontSize: 12, color: colors.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {t('subscriptions.valid_until')}
          </span>
          <span style={{ ...body, fontSize: 14, color: colors.textMain }}>
            {formatDateRu(result?.validUntil)}
          </span>
        </div>
      </div>

      <PrimaryButton onClick={onToProfile}>
        {t('subscriptions.purchase.success_view')}
      </PrimaryButton>
      <GhostButton onClick={onToHome}>{t('subscriptions.purchase.success_back')}</GhostButton>
    </div>
  );
}

export default function SubscriptionPurchaseScreen() {
  const { t, localized } = useTranslation();
  const { user, bookingDraft, navigate, purchaseSubscription, showToast } = useContext(AppContext);

  const sub = useMemo(() => getSubscription(bookingDraft?.subscriptionId), [bookingDraft]);

  const [step, setStep] = useState('intro');
  const [holders, setHolders] = useState(() => [
    { name: user?.name || '', phone: formatPhoneMask(phoneDigits(user?.phone || '')) },
    { name: '', phone: '' },
  ]);
  const [method, setMethod] = useState(null);
  const [result, setResult] = useState(null);

  // Processing → success
  useEffect(() => {
    if (step !== 'processing') return undefined;
    const tid = setTimeout(() => {
      const filled = holders.filter((h) => isPhoneValid(h.phone));
      const purchased = purchaseSubscription
        ? purchaseSubscription(sub.id, filled)
        : null;
      setResult(purchased);
      setStep('success');
    }, 1800);
    return () => clearTimeout(tid);
  }, [step, holders, sub, purchaseSubscription]);

  if (!sub) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ ...body, fontSize: 15, color: colors.textMuted, marginBottom: 20 }}>
          {t('subscriptions.purchase.not_found')}
        </div>
        <PrimaryButton onClick={() => navigate('catalog')}>
          {t('subscriptions.purchase.back_to_catalog')}
        </PrimaryButton>
      </div>
    );
  }

  if (step === 'intro') {
    return (
      <IntroStep
        sub={sub}
        t={t}
        localized={localized}
        onNext={() => setStep('holder')}
        onBack={() => navigate('catalog')}
      />
    );
  }

  if (step === 'holder') {
    // Trim holders to max allowed
    const trimmed = holders.slice(0, sub.holders);
    return (
      <HolderStep
        sub={sub}
        t={t}
        localized={localized}
        user={user}
        holders={trimmed}
        setHolders={(next) => setHolders(next.slice(0, sub.holders))}
        onNext={() => setStep('payment')}
        onBack={() => setStep('intro')}
      />
    );
  }

  if (step === 'payment') {
    return (
      <PaymentStep
        sub={sub}
        t={t}
        localized={localized}
        method={method}
        setMethod={setMethod}
        onPay={() => setStep('processing')}
        onBack={() => setStep('holder')}
      />
    );
  }

  if (step === 'processing') {
    return <ProcessingStep t={t} />;
  }

  // success
  return (
    <SuccessStep
      sub={sub}
      result={result}
      t={t}
      localized={localized}
      onToProfile={() => {
        if (showToast) showToast(t('subscriptions.purchase.success_toast'));
        navigate('profile');
      }}
      onToHome={() => navigate('home')}
    />
  );
}
