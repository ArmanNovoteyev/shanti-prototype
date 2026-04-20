import { useContext, useMemo, useState } from 'react';
import { Calendar, Check, Sparkles } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { services } from '../data/services.js';
import { masters } from '../data/masters.js';
import { branches } from '../data/branches.js';
import { colors } from '../theme/colors.js';
import { FONT_DISPLAY } from '../theme/fonts.js';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.02em' };
const body = { fontFamily: "'Manrope', sans-serif" };

const RU_MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function formatShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]}`;
}

function formatLong(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatPrice(v) {
  return `${v.toLocaleString('ru-RU')} ₸`;
}

function Eyebrow({ children, color }) {
  return (
    <div
      style={{
        ...body,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: color || colors.textMuted,
      }}
    >
      {children}
    </div>
  );
}

function StatCard({ total, lastVisit, lastServiceName }) {
  const { t } = useTranslation();
  return (
    <div
      style={{
        position: 'relative',
        background: colors.deepBrown,
        color: colors.ivory,
        borderRadius: 20,
        padding: '20px 22px',
        margin: '20px 20px 18px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          color: colors.copper,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      >
        <Sparkles size={32} strokeWidth={1.5} />
      </div>
      <Eyebrow color={colors.copperSoft}>{t('bookings.total_eyebrow')}</Eyebrow>
      <div
        style={{
          ...display,
          fontSize: 48,
          lineHeight: 1,
          marginTop: 10,
          color: colors.ivory,
        }}
      >
        {total}
      </div>
      {lastVisit && (
        <div
          style={{
            ...body,
            fontSize: 13,
            color: colors.ivory,
            opacity: 0.7,
            marginTop: 10,
          }}
        >
          {t('bookings.last_visit_label')} {formatShort(lastVisit)} · {lastServiceName}
        </div>
      )}
    </div>
  );
}

function Tabs({ active, onChange, upcomingCount, historyCount }) {
  const { t } = useTranslation();
  const TabBtn = ({ id, label, count }) => {
    const isActive = active === id;
    return (
      <button
        onClick={() => onChange(id)}
        style={{
          flex: 1,
          height: 46,
          borderRadius: 14,
          border: isActive ? 'none' : `1px solid ${colors.copper}`,
          background: isActive ? colors.deepBrown : colors.ivory,
          color: isActive ? colors.ivory : colors.deepBrown,
          ...body,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        {label} · {count}
      </button>
    );
  };
  return (
    <div style={{ display: 'flex', gap: 8, padding: '0 20px 16px' }}>
      <TabBtn id="upcoming" label={t('bookings.tab_upcoming')} count={upcomingCount} />
      <TabBtn id="history" label={t('bookings.tab_history')} count={historyCount} />
    </div>
  );
}

function VisitCard({ visit, kind, onRepeat, localized, t }) {
  const isHistory = kind === 'history';
  return (
    <div
      style={{
        background: colors.ivory,
        border: `1px solid ${colors.cream}`,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          {isHistory ? (
            <Check size={16} color={colors.success} strokeWidth={2.5} style={{ flexShrink: 0 }} />
          ) : (
            <Calendar size={16} color={colors.copper} strokeWidth={2} style={{ flexShrink: 0 }} />
          )}
          <div
            style={{
              ...display,
              fontSize: 18,
              color: colors.textMain,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {localized(visit.service, 'name')}
          </div>
        </div>
        <div style={{ ...display, fontSize: 16, color: colors.copper, flexShrink: 0 }}>
          {formatPrice(visit.price)}
        </div>
      </div>

      <div
        style={{
          ...body,
          fontSize: 13,
          color: colors.textMuted,
          marginTop: 8,
        }}
      >
        {localized(visit.master, 'name')} · {visit.durationMinutes} {t('common.minutes_short')} ·{' '}
        {localized(visit.branch, 'name')}
      </div>
      <div
        style={{
          ...body,
          fontSize: 13,
          color: colors.textMuted,
          marginTop: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          {formatLong(visit.date)} · {visit.time}
        </span>
        {isHistory && (
          <button
            onClick={() => onRepeat(visit.serviceId)}
            style={{
              ...body,
              fontSize: 13,
              color: colors.copper,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {t('bookings.repeat')} →
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onBook }) {
  const { t } = useTranslation();
  return (
    <div
      style={{
        background: colors.ivory,
        border: `1px solid ${colors.cream}`,
        borderRadius: 16,
        padding: '32px 20px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          ...display,
          fontSize: 18,
          color: colors.textMain,
          marginBottom: 16,
        }}
      >
        {t('bookings.empty_title')}
      </div>
      <button
        onClick={onBook}
        style={{
          background: colors.copper,
          color: colors.white,
          border: 'none',
          borderRadius: 28,
          height: 48,
          padding: '0 22px',
          ...body,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {t('bookings.empty_cta')}
      </button>
    </div>
  );
}

export default function BookingsListScreen() {
  const { t, localized } = useTranslation();
  const { bookings, bookingHistory, navigate } = useContext(AppContext);

  const resolvedHistory = useMemo(() => {
    return bookingHistory
      .map((h) => {
        const service = services.find((s) => s.id === h.serviceId);
        const master = masters.find((m) => m.id === h.masterId);
        const branch = branches.find((b) => b.id === h.branchId);
        if (!service || !master || !branch) {
          console.warn('[BookingsList] dropped visit', h.id, {
            serviceId: h.serviceId,
            masterId: h.masterId,
            branchId: h.branchId,
          });
          return null;
        }
        return { ...h, service, master, branch };
      })
      .filter(Boolean)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [bookingHistory]);

  const resolvedUpcoming = useMemo(() => {
    return bookings
      .map((b) => {
        const service = services.find((s) => s.id === b.serviceId);
        const master = masters.find((m) => m.id === b.masterId);
        const branch = branches.find((br) => br.id === b.branchId);
        if (!service || !master || !branch) return null;
        return { ...b, service, master, branch };
      })
      .filter(Boolean);
  }, [bookings]);

  const [activeTab, setActiveTab] = useState('history');

  const total = resolvedHistory.length;
  const last = resolvedHistory[0];
  const lastName = last ? localized(last.service, 'name') : '';

  const list = activeTab === 'history' ? resolvedHistory : resolvedUpcoming;

  return (
    <div style={{ background: colors.ivory, minHeight: '100vh', paddingBottom: 24 }}>
      <div style={{ padding: '20px 20px 0' }}>
        <h1
          style={{
            ...display,
            fontSize: 32,
            color: colors.textMain,
            margin: 0,
          }}
        >
          {t('bookings.title')}
        </h1>
        <div
          style={{
            ...body,
            fontSize: 14,
            color: colors.textMuted,
            marginTop: 6,
          }}
        >
          {t('bookings.subtitle')}
        </div>
      </div>

      <StatCard total={total} lastVisit={last?.date} lastServiceName={lastName} />

      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        upcomingCount={resolvedUpcoming.length}
        historyCount={resolvedHistory.length}
      />

      <div style={{ padding: '0 20px' }}>
        {list.length === 0 ? (
          <EmptyState onBook={() => navigate('booking')} />
        ) : (
          list.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              kind={activeTab}
              onRepeat={(serviceId) => navigate('service', { serviceId })}
              localized={localized}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}
