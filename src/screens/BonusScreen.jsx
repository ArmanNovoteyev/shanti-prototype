import { useContext, useMemo } from 'react';
import { Activity, Gift, UserPlus, Check, Sparkles } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { colors } from '../theme/colors.js';
import { FONT_DISPLAY, FONT_BODY } from '../theme/fonts.js';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.02em' };
const body = { ...FONT_BODY };

const cardBase = {
  background: colors.ivory,
  border: '1px solid rgba(42,32,25,0.06)',
  borderRadius: 24,
  padding: 20,
};

function formatPrice(v) {
  return Number(v).toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
}

function plural(n, one, two, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return two;
  return many;
}

function BalanceCard({ t, balance }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${colors.deepBrown} 0%, ${colors.warmDark} 100%)`,
        color: colors.ivory,
        padding: 22,
        borderRadius: 26,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Sparkles
        size={120}
        color={colors.copper}
        style={{ position: 'absolute', right: -28, top: -22, opacity: 0.12 }}
      />
      <div style={{ position: 'relative' }}>
        <div
          style={{
            ...body,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            opacity: 0.7,
            fontWeight: 700,
          }}
        >
          {t('bonus.balance')}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
          <div style={{ ...display, fontSize: 54, lineHeight: 1 }}>{formatPrice(balance)}</div>
          <div
            style={{
              ...body,
              fontSize: 13,
              letterSpacing: '0.14em',
              opacity: 0.75,
            }}
          >
            {t('bonus.balance_label')}
          </div>
        </div>
        <div style={{ ...body, fontSize: 12, marginTop: 10, opacity: 0.7 }}>
          {t('bonus.balance_hint')}
        </div>
      </div>
    </div>
  );
}

function BackBalanceCard({ t, tracker, onBook }) {
  const left = tracker.total - tracker.done;
  return (
    <div style={cardBase}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: colors.copperSoft,
            color: colors.copper,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Activity size={18} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              ...body,
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: colors.copper,
              fontWeight: 700,
            }}
          >
            {t('bonus.back_balance_eyebrow')}
          </div>
          <div style={{ ...display, fontSize: 19, color: colors.deepBrown, marginTop: 2 }}>
            {t('bonus.back_balance_title')}
          </div>
          <div style={{ ...body, fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
            {t('bonus.back_balance_subtitle')}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '22px 4px 10px',
          gap: 6,
        }}
      >
        {Array.from({ length: tracker.total }, (_, i) => {
          const done = i < tracker.done;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: done ? colors.copper : 'transparent',
                  border: `2px solid ${done ? colors.copper : 'rgba(42,32,25,0.18)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                {done && <Check size={14} color={colors.ivory} strokeWidth={3} />}
              </div>
              <div style={{ ...body, fontSize: 11, color: colors.textMuted }}>
                {i + 1}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
          fontSize: 13,
          color: colors.textMain,
          ...body,
        }}
      >
        <div>
          <span style={{ color: colors.textMuted }}>{t('bonus.visits_done')}:</span>{' '}
          <span>
            {t('bonus.visits_done_of', { done: tracker.done, total: tracker.total })}
          </span>
        </div>
        <div>
          <span style={{ color: colors.textMuted }}>{t('bonus.visits_left')}:</span>{' '}
          <span>
            {left} {plural(left, 'визит', 'визита', 'визитов')}
          </span>
        </div>
      </div>

      <button
        onClick={onBook}
        style={{
          ...body,
          width: '100%',
          marginTop: 18,
          background: colors.copper,
          color: colors.ivory,
          border: 'none',
          padding: 15,
          borderRadius: 18,
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 10px 24px -12px rgba(184,121,74,0.5)',
        }}
      >
        {t('bonus.book_next')}
      </button>
    </div>
  );
}

function FifthVisitCard({ t, progress }) {
  return (
    <div style={cardBase}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
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
          <Gift size={16} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...display, fontSize: 17, color: colors.deepBrown, lineHeight: 1.2 }}>
            {t('bonus.fifth_visit_title')}
          </div>
        </div>
      </div>

      <div style={{ ...body, fontSize: 13, color: colors.textMain, marginBottom: 10 }}>
        {t('bonus.fifth_visit_line', { done: progress.done, left: progress.remaining })}
      </div>

      <div
        style={{
          width: '100%',
          height: 10,
          background: colors.cream,
          borderRadius: 5,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress.percent}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${colors.copper} 0%, ${colors.copperSoft} 100%)`,
            transition: 'width 0.4s',
            borderRadius: 5,
          }}
        />
      </div>
    </div>
  );
}

function ReferralCard({ t, onInvite }) {
  return (
    <div
      style={{
        ...cardBase,
        display: 'flex',
        gap: 14,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: colors.copperSoft,
          color: colors.copper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <UserPlus size={20} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...display, fontSize: 16, color: colors.deepBrown, lineHeight: 1.2 }}>
          {t('bonus.invite_title')}
        </div>
        <div style={{ ...body, fontSize: 12, color: colors.textMuted, marginTop: 3 }}>
          {t('bonus.invite_reward')}
        </div>
      </div>
      <button
        onClick={onInvite}
        style={{
          ...body,
          background: colors.deepBrown,
          color: colors.ivory,
          border: 'none',
          padding: '11px 16px',
          borderRadius: 14,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {t('bonus.invite_cta')}
      </button>
    </div>
  );
}

function HistoryCard({ t, items }) {
  return (
    <div style={cardBase}>
      <div
        style={{
          ...body,
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: colors.textMuted,
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        {t('bonus.history_title')}
      </div>
      {items.map((item, idx) => {
        const isEarned = item.delta > 0;
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom:
                idx < items.length - 1 ? '1px solid rgba(42,32,25,0.06)' : 'none',
              gap: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...body, fontSize: 13, color: colors.textMain }}>
                {item.title}
              </div>
              <div style={{ ...body, fontSize: 11, color: colors.textMuted, marginTop: 3 }}>
                {item.subtitle}
              </div>
            </div>
            <div
              style={{
                ...display,
                fontSize: 17,
                color: isEarned ? colors.success : colors.textMuted,
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {isEarned ? `+${formatPrice(item.delta)}` : `−${formatPrice(Math.abs(item.delta))}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BonusScreen() {
  const { t } = useTranslation();
  const { bonus, backBalance, startBookingFor, showToast } = useContext(AppContext);

  const progress = useMemo(() => {
    const total = 5;
    const done = Math.max(0, total - (bonus?.visitsToFifth ?? 0));
    const remaining = bonus?.visitsToFifth ?? total;
    return { done, remaining, percent: Math.min(100, (done / total) * 100) };
  }, [bonus]);

  const history = useMemo(
    () => [
      {
        delta: 230,
        title: t('bonus.history_earned', { amount: 230 }),
        subtitle: 'Вторая жизнь · 15 апр',
      },
      {
        delta: -500,
        title: t('bonus.history_spent', { amount: 500 }),
        subtitle: 'Оплата массажа · 8 апр',
      },
      {
        delta: 2000,
        title: t('bonus.history_invite', { name: 'Гульнара' }),
        subtitle: '3 апр',
      },
      {
        delta: 180,
        title: t('bonus.history_earned', { amount: 180 }),
        subtitle: 'Сила Будды · 29 мар',
      },
    ],
    [t],
  );

  const handleBookNext = () => {
    const nextIdx = backBalance.done;
    const serviceId = nextIdx < 2 ? 'clear-mind' : 'gracia';
    startBookingFor(serviceId, { durationMinutes: 60 });
    showToast(
      t('bonus.back_balance_session_toast', {
        n: nextIdx + 1,
        total: backBalance.total,
      }),
    );
  };
  const handleInvite = () => showToast(t('bonus.invite_toast'));

  return (
    <div
      style={{
        padding: '8px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <h1
        style={{
          ...display,
          fontSize: 28,
          color: colors.deepBrown,
          margin: '4px 4px 2px',
          lineHeight: 1.1,
        }}
      >
        {t('bonus.title')}
      </h1>

      <BalanceCard t={t} balance={bonus.balance} />

      {backBalance.purchased && (
        <BackBalanceCard t={t} tracker={backBalance} onBook={handleBookNext} />
      )}

      <FifthVisitCard t={t} progress={progress} />

      <ReferralCard t={t} onInvite={handleInvite} />

      <HistoryCard t={t} items={history} />
    </div>
  );
}
