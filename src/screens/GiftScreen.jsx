import { useContext, useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  Gift,
  Wallet,
  CreditCard,
  User,
  Send,
  FileText,
  Sparkles,
  Check,
} from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import GiftCertificate, { GIFT_DESIGNS, getDesignConfig } from '../components/GiftCertificate.jsx';

const tokens = {
  deepSage: '#344237',
  sage: '#4A5D4F',
  copper: '#B8794A',
  copperSoft: 'rgba(184,121,74,0.10)',
  ivory: '#FBF8F1',
  cream: '#F2EDE3',
  muted: '#8A8B86',
  text: '#2A2E28',
};

const display = { fontFamily: "'Fraunces', serif", fontWeight: 500, letterSpacing: '-0.02em' };
const body = { fontFamily: "'Manrope', sans-serif" };

const MIN_AMOUNT = 20000;
const PRESET_AMOUNTS = [20000, 35000, 50000, 100000];
const DESIGN_LABEL_KEY = {
  ny: 'gift.design_ny',
  march8: 'gift.design_8march',
  birthday: 'gift.design_birthday',
  dark: 'gift.design_daily_dark',
  light: 'gift.design_daily_light',
};

function formatPrice(v) {
  if (v == null || v === '') return '';
  return Number(v).toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
}

function parseAmountInput(str) {
  const digits = (str || '').replace(/\D/g, '');
  if (!digits) return null;
  return Number(digits);
}

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

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SH-2026-${suffix}`;
}

function addMonths(d, months) {
  const res = new Date(d);
  res.setMonth(res.getMonth() + months);
  return res;
}

function daysBetween(from, to) {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function PrimaryButton({ children, onClick, disabled, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...body,
        width: '100%',
        background: disabled ? tokens.cream : tokens.copper,
        color: disabled ? tokens.muted : tokens.ivory,
        border: 'none',
        padding: '17px',
        borderRadius: '20px',
        fontSize: '15px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 10px 24px -10px rgba(184,121,74,0.55)',
        transition: 'background 0.2s, box-shadow 0.2s',
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

function OutlineButton({ children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...body,
        width: '100%',
        background: 'transparent',
        color: tokens.deepSage,
        border: `1.5px solid ${tokens.deepSage}`,
        padding: '15px',
        borderRadius: '20px',
        fontSize: '15px',
        fontWeight: 600,
        cursor: 'pointer',
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

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...body,
        background: tokens.cream,
        border: 'none',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      aria-label="back"
    >
      <ChevronLeft size={18} color={tokens.deepSage} />
    </button>
  );
}

function StepShell({ title, subtitle, onBack, children, footer }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ padding: '4px 24px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ ...display, fontSize: '22px', color: tokens.deepSage, lineHeight: 1.15 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ ...body, color: tokens.muted, fontSize: 13, marginTop: 4 }}>{subtitle}</div>
          )}
        </div>
      </div>
      <div style={{ padding: '0 24px', flex: 1 }}>{children}</div>
      {footer && <div style={{ padding: '20px 24px 0' }}>{footer}</div>}
    </div>
  );
}

function GiftBoxArt() {
  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      style={{ display: 'block', margin: '0 auto' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="box-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A5D4F" />
          <stop offset="100%" stopColor="#2D382F" />
        </linearGradient>
        <linearGradient id="box-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#56685A" />
          <stop offset="100%" stopColor="#3A4940" />
        </linearGradient>
      </defs>

      <ellipse cx="90" cy="160" rx="62" ry="6" fill="rgba(42,46,40,0.14)" />

      <rect x="26" y="72" width="128" height="84" rx="8" fill="url(#box-body)" />
      <rect x="22" y="62" width="136" height="22" rx="6" fill="url(#box-lid)" />

      <rect x="85" y="62" width="10" height="94" fill="#B8794A" />
      <rect x="22" y="70" width="136" height="7" fill="#B8794A" />

      <path
        d="M90 62 C 72 56, 62 46, 64 40 C 66 34, 78 34, 82 44 C 85 52, 90 60, 90 62 Z"
        fill="#B8794A"
      />
      <path
        d="M90 62 C 108 56, 118 46, 116 40 C 114 34, 102 34, 98 44 C 95 52, 90 60, 90 62 Z"
        fill="#B8794A"
      />
      <circle cx="90" cy="60" r="5" fill="#8E5B36" />

      <g transform="translate(90 30)" opacity="0.85">
        <path
          d="M0 20 Q -14 10 -16 -4 Q -8 2 0 10 Z"
          fill="#F2EDE3"
          stroke="#B8794A"
          strokeWidth="0.8"
        />
        <path
          d="M0 20 Q 14 10 16 -4 Q 8 2 0 10 Z"
          fill="#F2EDE3"
          stroke="#B8794A"
          strokeWidth="0.8"
        />
        <path
          d="M0 22 Q -8 12 -8 -2 Q 0 4 0 14 Z"
          fill="#FBF8F1"
          stroke="#B8794A"
          strokeWidth="0.8"
        />
        <path
          d="M0 22 Q 8 12 8 -2 Q 0 4 0 14 Z"
          fill="#FBF8F1"
          stroke="#B8794A"
          strokeWidth="0.8"
        />
        <ellipse cx="0" cy="16" rx="3" ry="5" fill="#B8794A" />
      </g>

      <g opacity="0.55" fill="#C9A961">
        <circle cx="30" cy="40" r="1.5" />
        <circle cx="150" cy="48" r="1.5" />
        <circle cx="160" cy="110" r="1.5" />
        <circle cx="20" cy="120" r="1.5" />
      </g>
    </svg>
  );
}

function HowItWorks({ t }) {
  const steps = [
    { Icon: Wallet, label: t('gift.step_amount') },
    { Icon: User, label: t('gift.step_recipient') },
    { Icon: CreditCard, label: t('gift.step_pay') },
    { Icon: Send, label: t('gift.step_send') },
  ];
  return (
    <div>
      <div
        style={{
          ...body,
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: tokens.muted,
          fontWeight: 600,
          marginBottom: 14,
        }}
      >
        {t('gift.how_it_works')}
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {steps.map((s, idx) => {
          const Icon = s.Icon;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: tokens.ivory,
                border: '1px solid rgba(42,46,40,0.06)',
                borderRadius: 16,
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: tokens.copperSoft,
                  color: tokens.copper,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} strokeWidth={2} />
              </div>
              <div style={{ ...body, fontSize: 14, color: tokens.text }}>
                <span style={{ color: tokens.muted, marginRight: 6 }}>{idx + 1}</span>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PromoBanner({ t }) {
  const now = useMemo(() => new Date(), []);
  const target = useMemo(() => new Date(2026, 4, 7), []);
  if (now >= target) return null;
  const days = daysBetween(now, target);
  return (
    <div
      style={{
        marginTop: 20,
        background: 'linear-gradient(135deg, rgba(184,121,74,0.16) 0%, rgba(184,121,74,0.05) 100%)',
        border: '1px solid rgba(184,121,74,0.25)',
        borderRadius: 18,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: tokens.copper,
          color: tokens.ivory,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Sparkles size={16} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            ...body,
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: tokens.copper,
            fontWeight: 700,
          }}
        >
          {t('gift.promo_eyebrow')}
        </div>
        <div style={{ ...body, fontSize: 14, color: tokens.text, fontWeight: 500, marginTop: 2 }}>
          {t('gift.promo_title')}
        </div>
      </div>
      <div
        style={{
          ...display,
          fontSize: 20,
          color: tokens.copper,
          textAlign: 'center',
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {days}
        <div style={{ ...body, fontSize: 9, color: tokens.muted, marginTop: 2, textTransform: 'lowercase' }}>
          {t('gift.promo_days_left')}
        </div>
      </div>
    </div>
  );
}

function IntroStep({ t, onStart }) {
  return (
    <div style={{ padding: '8px 24px 24px' }}>
      <div style={{ textAlign: 'center', paddingTop: 12 }}>
        <div
          style={{
            ...body,
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: tokens.copper,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Shanti
        </div>
        <h1 style={{ ...display, fontSize: 32, color: tokens.deepSage, margin: '0 0 8px', lineHeight: 1.1 }}>
          {t('gift.title')}
        </h1>
        <p style={{ ...body, color: tokens.muted, fontSize: 14, margin: '0 0 20px', lineHeight: 1.45 }}>
          {t('gift.subtitle')}
        </p>
        <GiftBoxArt />
        <div style={{ marginTop: 20 }}>
          <PrimaryButton onClick={onStart} icon={Gift}>
            {t('gift.create')}
          </PrimaryButton>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <HowItWorks t={t} />
      </div>

      <PromoBanner t={t} />
    </div>
  );
}

function AmountStep({ t, value, onChange, onNext, onBack }) {
  const valid = value != null && value >= MIN_AMOUNT;
  const hasValue = value != null && value > 0;
  const handleInput = (e) => {
    onChange(parseAmountInput(e.target.value));
  };
  return (
    <StepShell
      title={t('gift.amount_title')}
      onBack={onBack}
      footer={
        <PrimaryButton disabled={!valid} onClick={onNext}>
          {t('common.next')}
        </PrimaryButton>
      }
    >
      <div style={{ paddingTop: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 8,
            padding: '28px 0 12px',
            minHeight: 100,
          }}
        >
          <input
            type="text"
            inputMode="numeric"
            value={hasValue ? formatPrice(value) : ''}
            onChange={handleInput}
            placeholder="0"
            autoFocus
            style={{
              ...display,
              fontSize: 56,
              background: 'none',
              border: 'none',
              color: tokens.deepSage,
              textAlign: 'right',
              outline: 'none',
              width: '60%',
              padding: 0,
              lineHeight: 1,
            }}
          />
          <div style={{ ...display, fontSize: 36, color: tokens.muted, lineHeight: 1.1 }}>₸</div>
        </div>
        <div
          style={{
            ...body,
            textAlign: 'center',
            color: valid || !hasValue ? tokens.muted : tokens.copper,
            fontSize: 13,
          }}
        >
          {t('gift.amount_min')}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 36,
          }}
        >
          {PRESET_AMOUNTS.map((amount) => {
            const active = value === amount;
            return (
              <button
                key={amount}
                onClick={() => onChange(amount)}
                style={{
                  ...body,
                  background: active ? tokens.deepSage : tokens.ivory,
                  color: active ? tokens.ivory : tokens.text,
                  border: active ? 'none' : '1px solid rgba(42,46,40,0.08)',
                  borderRadius: 14,
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {formatPrice(amount)} ₸
              </button>
            );
          })}
        </div>
      </div>
    </StepShell>
  );
}

function FormField({ label, required, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          ...body,
          fontSize: 12,
          color: tokens.muted,
          marginBottom: 6,
          fontWeight: 500,
        }}
      >
        {label}
        {required && <span style={{ color: tokens.copper, marginLeft: 4 }}>*</span>}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  ...body,
  width: '100%',
  background: tokens.cream,
  border: '1px solid rgba(42,46,40,0.06)',
  borderRadius: 14,
  padding: '14px 16px',
  fontSize: 15,
  color: tokens.text,
  outline: 'none',
  boxSizing: 'border-box',
  fontWeight: 500,
};

function RecipientStep({ t, draft, setDraft, onNext, onBack }) {
  const phoneOk = isPhoneValid(draft.recipientPhone);
  return (
    <StepShell
      title={t('gift.recipient_title')}
      onBack={onBack}
      footer={
        <PrimaryButton disabled={!phoneOk} onClick={onNext}>
          {t('gift.to_payment')}
        </PrimaryButton>
      }
    >
      <div style={{ paddingTop: 12 }}>
        <FormField label={t('gift.recipient_phone')} required>
          <input
            type="tel"
            inputMode="numeric"
            value={formatPhoneMask(draft.recipientPhone)}
            onChange={(e) => setDraft((p) => ({ ...p, recipientPhone: phoneDigits(e.target.value) }))}
            placeholder={t('gift.recipient_phone_placeholder')}
            style={inputStyle}
          />
        </FormField>
        <FormField label={t('gift.recipient_name')}>
          <input
            type="text"
            value={draft.recipientName}
            onChange={(e) => setDraft((p) => ({ ...p, recipientName: e.target.value }))}
            placeholder="Айгерим"
            style={inputStyle}
          />
        </FormField>
        <FormField label={t('gift.sender_name')}>
          <input
            type="text"
            value={draft.senderName}
            onChange={(e) => setDraft((p) => ({ ...p, senderName: e.target.value }))}
            placeholder="Арман"
            style={inputStyle}
          />
        </FormField>
      </div>
    </StepShell>
  );
}

function KaspiMark() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: '#F14635',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: '-0.04em',
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      kaspi
    </div>
  );
}

function CardMark() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: tokens.deepSage,
        color: tokens.ivory,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CreditCard size={18} strokeWidth={2} />
    </div>
  );
}

function PaymentMethodRow({ active, onClick, label, mark }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...body,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        background: active ? tokens.cream : tokens.ivory,
        border: active ? `1.5px solid ${tokens.deepSage}` : '1px solid rgba(42,46,40,0.08)',
        borderRadius: 18,
        cursor: 'pointer',
        marginBottom: 10,
        textAlign: 'left',
      }}
    >
      {mark}
      <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: tokens.text }}>{label}</div>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: `2px solid ${active ? tokens.deepSage : 'rgba(42,46,40,0.18)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: active ? tokens.deepSage : 'transparent',
        }}
      >
        {active && <Check size={12} color={tokens.ivory} strokeWidth={3} />}
      </div>
    </button>
  );
}

function PaymentStep({ t, draft, onPaid, onBack, paying }) {
  const [method, setMethod] = useState('kaspi');
  return (
    <StepShell
      title={t('gift.payment_title')}
      onBack={paying ? () => {} : onBack}
      footer={
        <PrimaryButton disabled={paying} onClick={() => onPaid(method)}>
          {paying ? t('gift.pay_processing') : `${t('gift.pay_cta')} ${formatPrice(draft.amount)} ₸`}
        </PrimaryButton>
      }
    >
      <div style={{ paddingTop: 4 }}>
        <div
          style={{
            background: tokens.deepSage,
            color: tokens.ivory,
            padding: 18,
            borderRadius: 22,
            marginBottom: 22,
          }}
        >
          <div style={{ ...body, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7 }}>
            {t('gift.certificate_title')}
          </div>
          <div style={{ ...display, fontSize: 30, marginTop: 6, lineHeight: 1 }}>
            {formatPrice(draft.amount)} ₸
          </div>
          {(draft.recipientName || draft.senderName) && (
            <div style={{ ...body, fontSize: 13, marginTop: 10, lineHeight: 1.55, opacity: 0.85 }}>
              {draft.recipientName && (
                <div>
                  <span style={{ opacity: 0.6 }}>{t('gift.for_recipient')}: </span>
                  {draft.recipientName}
                </div>
              )}
              {draft.senderName && (
                <div>
                  <span style={{ opacity: 0.6 }}>{t('gift.from_sender')}: </span>
                  {draft.senderName}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            ...body,
            color: tokens.muted,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          Способ оплаты
        </div>
        <PaymentMethodRow
          active={method === 'kaspi'}
          onClick={() => !paying && setMethod('kaspi')}
          label={t('gift.payment_kaspi')}
          mark={<KaspiMark />}
        />
        <PaymentMethodRow
          active={method === 'card'}
          onClick={() => !paying && setMethod('card')}
          label={t('gift.payment_card')}
          mark={<CardMark />}
        />

        {paying && (
          <div
            style={{
              ...body,
              textAlign: 'center',
              color: tokens.muted,
              fontSize: 13,
              marginTop: 14,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                margin: '0 auto 8px',
                borderRadius: '50%',
                border: `3px solid ${tokens.cream}`,
                borderTopColor: tokens.copper,
                animation: 'shanti-spin 0.8s linear infinite',
              }}
            />
            {t('gift.pay_processing')}…
          </div>
        )}
      </div>
    </StepShell>
  );
}

function DesignStep({ t, draft, onPick, onBack }) {
  return (
    <StepShell
      title={t('gift.design_title')}
      subtitle={t('gift.design_subtitle')}
      onBack={onBack}
    >
      <div
        style={{
          marginLeft: -24,
          marginRight: -24,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 14,
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          {GIFT_DESIGNS.map((id) => {
            const cfg = getDesignConfig(id);
            return (
              <button
                key={id}
                onClick={() => onPick(id)}
                style={{
                  ...body,
                  scrollSnapAlign: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <GiftCertificate
                  design={id}
                  amount={draft.amount}
                  recipientName={draft.recipientName}
                  senderName={draft.senderName}
                  code={draft.code || 'SH-2026-PREV'}
                  validUntil={draft.validUntil || addMonths(new Date(), 3)}
                  width={280}
                />
                <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>
                  <span style={{ marginRight: 6 }}>{cfg.emoji}</span>
                  {t(DESIGN_LABEL_KEY[id])}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </StepShell>
  );
}

function ReadyStep({ t, draft, onSend, onDownload, onHome }) {
  return (
    <div style={{ padding: '4px 24px 24px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ padding: '0 0 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={onHome} />
      </div>

      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <div
          style={{
            ...body,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: tokens.copper,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          ✓ Оплачено
        </div>
        <div style={{ ...display, fontSize: 28, color: tokens.deepSage, marginBottom: 4 }}>
          {t('gift.ready')}
        </div>
        <div style={{ ...body, color: tokens.muted, fontSize: 13, marginBottom: 18 }}>
          {t('gift.ready_subtitle')}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GiftCertificate
            design={draft.design}
            amount={draft.amount}
            recipientName={draft.recipientName}
            senderName={draft.senderName}
            code={draft.code || 'SH-2026-READY'}
            validUntil={draft.validUntil || addMonths(new Date(), 3)}
            width={320}
          />
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'grid', gap: 10 }}>
        <PrimaryButton onClick={onSend} icon={Send}>
          {t('gift.send_wa')}
        </PrimaryButton>
        <OutlineButton onClick={onDownload} icon={FileText}>
          {t('gift.download_pdf')}
        </OutlineButton>
      </div>

      <button
        onClick={onHome}
        style={{
          ...body,
          marginTop: 14,
          background: 'none',
          border: 'none',
          color: tokens.muted,
          fontSize: 13,
          cursor: 'pointer',
          padding: 8,
          alignSelf: 'center',
          textDecoration: 'underline',
        }}
      >
        {t('gift.to_home')}
      </button>
    </div>
  );
}

function SpinnerStyles() {
  useEffect(() => {
    if (document.querySelector('style[data-shanti-spinner]')) return;
    const style = document.createElement('style');
    style.dataset.shantiSpinner = 'true';
    style.textContent = '@keyframes shanti-spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }, []);
  return null;
}

export default function GiftScreen() {
  const { t } = useTranslation();
  const { giftDraft, setGiftDraft, resetGiftDraft, navigate, showToast } = useContext(AppContext);
  const [history, setHistory] = useState(['intro']);
  const [paying, setPaying] = useState(false);
  const step = history[history.length - 1];

  const goTo = (name) => setHistory((h) => [...h, name]);
  const goBack = () => {
    if (history.length === 1) {
      resetGiftDraft();
      navigate('home');
      return;
    }
    setHistory((h) => h.slice(0, -1));
  };

  const handleStart = () => {
    resetGiftDraft();
    goTo('amount');
  };

  const handleAmountChange = (amount) => setGiftDraft((p) => ({ ...p, amount }));
  const handleAmountNext = () => goTo('recipient');

  const handleRecipientNext = () => goTo('payment');

  const handlePaid = () => {
    if (paying) return;
    setPaying(true);
    setTimeout(() => {
      const code = generateCode();
      const validUntil = addMonths(new Date(), 3).toISOString();
      setGiftDraft((p) => ({ ...p, code, validUntil }));
      setPaying(false);
      goTo('design');
    }, 1600);
  };

  const handleDesignPick = (designId) => {
    setGiftDraft((p) => ({ ...p, design: designId }));
    goTo('ready');
  };

  const handleSendWA = () => {
    const digits = (giftDraft.recipientPhone || '').replace(/\D/g, '');
    const cfg = getDesignConfig(giftDraft.design);
    const amountText = formatPrice(giftDraft.amount) + ' ₸';
    const greet = giftDraft.recipientName
      ? `${giftDraft.recipientName}, вам подарок от Shanti Thai SPA`
      : 'Вам подарок от Shanti Thai SPA';
    const msg = `${cfg.emoji} ${greet} — сертификат на ${amountText}! Код: ${giftDraft.code}. Ждём вас на Сатпаева 50/1 или Нурмагамбетова 4.`;
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
    showToast(t('gift.sent_toast'));
  };

  const handleDownloadPdf = () => {
    showToast(t('gift.pdf_toast'));
  };

  const handleHome = () => {
    resetGiftDraft();
    setHistory(['intro']);
    navigate('home');
  };

  return (
    <>
      <SpinnerStyles />
      {step === 'intro' && <IntroStep t={t} onStart={handleStart} />}
      {step === 'amount' && (
        <AmountStep
          t={t}
          value={giftDraft.amount}
          onChange={handleAmountChange}
          onNext={handleAmountNext}
          onBack={goBack}
        />
      )}
      {step === 'recipient' && (
        <RecipientStep
          t={t}
          draft={giftDraft}
          setDraft={setGiftDraft}
          onNext={handleRecipientNext}
          onBack={goBack}
        />
      )}
      {step === 'payment' && (
        <PaymentStep
          t={t}
          draft={giftDraft}
          onPaid={handlePaid}
          onBack={goBack}
          paying={paying}
        />
      )}
      {step === 'design' && (
        <DesignStep
          t={t}
          draft={giftDraft}
          onPick={handleDesignPick}
          onBack={goBack}
        />
      )}
      {step === 'ready' && (
        <ReadyStep
          t={t}
          draft={giftDraft}
          onSend={handleSendWA}
          onDownload={handleDownloadPdf}
          onHome={handleHome}
        />
      )}
    </>
  );
}
