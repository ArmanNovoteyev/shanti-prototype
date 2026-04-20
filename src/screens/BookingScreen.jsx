import { useContext, useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star, Sparkles, Clock, Calendar, Check, Heart, Users } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { getService } from '../data/services.js';
import { branches, getBranch } from '../data/branches.js';
import { mastersForBranch, getMaster } from '../data/masters.js';
import { colors } from '../theme/colors.js';
import { isHappyHoursAt, applyHappyHoursDiscount } from '../utils/happyHours.js';
import { FONT_DISPLAY, FONT_BODY } from '../theme/fonts.js';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.02em' };
const body = { ...FONT_BODY };

const TIME_SLOTS = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30'];
const RU_MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const RU_DOW = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

function formatPrice(v) {
  return v.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
}

function toIsoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function StepShell({ title, onBack, children, footer }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ padding: '4px 24px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{
            ...body,
            background: colors.cream,
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
          <ChevronLeft size={18} color={colors.deepBrown} />
        </button>
        <div style={{ ...display, fontSize: '22px', color: colors.deepBrown, lineHeight: 1.15 }}>
          {title}
        </div>
      </div>
      <div style={{ padding: '0 24px', flex: 1 }}>{children}</div>
      {footer && <div style={{ padding: '20px 24px 0' }}>{footer}</div>}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }) {
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
        borderRadius: '20px',
        fontSize: '15px',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 10px 24px -10px rgba(184,121,74,0.55)',
      }}
    >
      {children}
    </button>
  );
}

function ChoiceCard({ active, onClick, disabled, title, subtitle, accessory, icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...body,
        textAlign: 'left',
        background: active ? colors.deepBrown : colors.ivory,
        color: active ? colors.ivory : colors.textMain,
        border: active ? 'none' : '1px solid rgba(42,32,25,0.08)',
        borderRadius: '20px',
        padding: '16px',
        marginBottom: '10px',
        width: '100%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      {icon && <div style={{ flexShrink: 0 }}>{icon}</div>}
      <div style={{ flex: 1 }}>
        <div style={{ ...display, fontSize: '17px', lineHeight: 1.2 }}>{title}</div>
        {subtitle && (
          <div
            style={{
              fontSize: '12px',
              opacity: active ? 0.75 : 1,
              color: active ? colors.ivory : colors.textMuted,
              marginTop: '4px',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {accessory}
    </button>
  );
}

function BranchStep({ service, draft, onPick, onBack }) {
  const { t, localized } = useTranslation();
  const trio = draft.partyPeople === 3;
  return (
    <StepShell title={t('booking.choose_branch')} onBack={onBack}>
      {branches.map((b) => {
        const disabled = trio && !b.supports_trio_party;
        const active = draft.branchId === b.id;
        return (
          <ChoiceCard
            key={b.id}
            active={active}
            disabled={disabled}
            onClick={() => !disabled && onPick(b.id)}
            icon={
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: active ? 'rgba(240,230,217,0.12)' : colors.cream,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MapPin size={18} color={active ? colors.ivory : colors.deepBrown} />
              </div>
            }
            title={localized(b, 'name')}
            subtitle={
              disabled
                ? t('booking.trio_only_satpayeva_short')
                : `${localized(b, 'address')} · ${b.rating} ★ · ${b.hours}`
            }
          />
        );
      })}
    </StepShell>
  );
}

function VisitTypeStep({ draft, onPick, onBack }) {
  const { t } = useTranslation();
  return (
    <StepShell title={t('booking.visit_type_title')} onBack={onBack}>
      <ChoiceCard
        active={draft.visitType === 'date'}
        onClick={() => onPick('date')}
        icon={
          <div style={{ fontSize: 26 }} aria-hidden>
            💕
          </div>
        }
        title={t('booking.visit_type_date')}
        subtitle={t('booking.visit_type_date_subtitle')}
      />
      <ChoiceCard
        active={draft.visitType === 'party'}
        onClick={() => onPick('party')}
        icon={
          <div style={{ fontSize: 26 }} aria-hidden>
            👯
          </div>
        }
        title={t('booking.visit_type_party')}
        subtitle={t('booking.visit_type_party_subtitle')}
      />
    </StepShell>
  );
}

function PartyPeopleStep({ draft, onPick, onBack }) {
  const { t } = useTranslation();
  return (
    <StepShell title={t('booking.party_people')} onBack={onBack}>
      <ChoiceCard
        active={draft.partyPeople === 2}
        onClick={() => onPick(2)}
        icon={<Users size={22} color={colors.copper} />}
        title={t('booking.people_two')}
        subtitle={t('booking.people_two_subtitle')}
      />
      <ChoiceCard
        active={draft.partyPeople === 3}
        onClick={() => onPick(3)}
        icon={<Users size={22} color={colors.copper} />}
        title={t('booking.people_three')}
        subtitle={t('booking.people_three_subtitle')}
      />
    </StepShell>
  );
}

function DurationStep({ service, draft, onPick, onBack }) {
  const { t } = useTranslation();
  return (
    <StepShell title={t('booking.choose_duration')} onBack={onBack}>
      {service.durations.map((d) => {
        const active = draft.durationMinutes === d.minutes;
        return (
          <ChoiceCard
            key={d.minutes}
            active={active}
            onClick={() => onPick(d.minutes)}
            icon={
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: active ? 'rgba(240,230,217,0.12)' : colors.cream,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock size={18} color={active ? colors.ivory : colors.deepBrown} />
              </div>
            }
            title={`${d.minutes} ${t('common.minutes_short')}`}
            subtitle={`${formatPrice(d.price)} ${t('common.rub')}`}
          />
        );
      })}
    </StepShell>
  );
}

function MasterAvatar({ name, isAny }) {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors.deepBrown} 0%, ${colors.copper} 100%)`,
        color: colors.ivory,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...FONT_DISPLAY,
        fontSize: 19,
        flexShrink: 0,
      }}
    >
      {isAny ? <Sparkles size={18} /> : name.charAt(0)}
    </div>
  );
}

function MasterStep({ draft, onPick, onBack }) {
  const { t, localized } = useTranslation();
  const list = mastersForBranch(draft.branchId);
  return (
    <StepShell title={t('booking.choose_master')} onBack={onBack}>
      <ChoiceCard
        active={draft.masterId === 'any'}
        onClick={() => onPick('any')}
        icon={<MasterAvatar name="?" isAny />}
        title={t('booking.any_master')}
        subtitle={t('booking.any_master_subtitle')}
      />
      {list.map((m) => {
        const active = draft.masterId === m.id;
        const name = localized(m, 'name');
        return (
          <ChoiceCard
            key={m.id}
            active={active}
            onClick={() => onPick(m.id)}
            icon={<MasterAvatar name={name} />}
            title={name}
            subtitle={`${t('booking.master_experience', { years: m.experience_years })} · ${localized(m, 'specialty')}`}
            accessory={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  color: active ? colors.ivory : colors.copper,
                }}
              >
                <Star size={11} fill="currentColor" /> {m.rating}
              </div>
            }
          />
        );
      })}
    </StepShell>
  );
}

function DateTimeStep({ draft, onPickDate, onPickTime, onConfirm, onBack }) {
  const { t } = useTranslation();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [today.getTime()]);

  const selectedDate = draft.date || toIsoDate(days[0]);
  const selectedTime = draft.time;

  useEffect(() => {
    if (!draft.date) onPickDate(toIsoDate(days[0]));
  }, []);

  return (
    <StepShell
      title={t('booking.choose_datetime')}
      onBack={onBack}
      footer={
        <PrimaryButton disabled={!selectedTime} onClick={onConfirm}>
          {t('common.continue')}
        </PrimaryButton>
      }
    >
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px',
        }}
      >
        {days.map((d, i) => {
          const iso = toIsoDate(d);
          const active = selectedDate === iso;
          let label;
          if (i === 0) label = t('booking.today');
          else if (i === 1) label = t('booking.tomorrow');
          else label = RU_DOW[d.getDay()];
          return (
            <button
              key={iso}
              onClick={() => onPickDate(iso)}
              style={{
                ...body,
                flexShrink: 0,
                minWidth: '60px',
                padding: '10px 6px',
                borderRadius: '16px',
                background: active ? colors.deepBrown : colors.ivory,
                color: active ? colors.ivory : colors.deepBrown,
                border: active ? 'none' : '1px solid rgba(42,32,25,0.08)',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '10px', opacity: 0.7, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {label}
              </div>
              <div style={{ ...display, fontSize: '18px', marginTop: '2px' }}>{d.getDate()}</div>
              <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>{RU_MONTHS[d.getMonth()]}</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        {TIME_SLOTS.map((slot) => {
          const active = selectedTime === slot;
          const isHappy = isHappyHoursAt(selectedDate, slot);
          return (
            <button
              key={slot}
              onClick={() => onPickTime(slot)}
              style={{
                ...body,
                padding: '12px 0',
                borderRadius: '14px',
                background: active ? colors.copper : colors.ivory,
                color: active ? colors.ivory : colors.deepBrown,
                border: active ? 'none' : '1px solid rgba(42,32,25,0.08)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                position: 'relative',
              }}
            >
              {slot}
              {isHappy && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 6,
                    fontSize: '8px',
                    fontWeight: 700,
                    color: active ? colors.ivory : colors.copper,
                    letterSpacing: '0.04em',
                  }}
                >
                  −20%
                </span>
              )}
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', fontSize: 13 }}>
      <span style={{ opacity: 0.7 }}>{label}</span>
      <span style={{ textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function ConfirmStep({ service, draft, onConfirm, onBack }) {
  const { t, localized } = useTranslation();
  const branch = getBranch(draft.branchId);
  const master = draft.masterId === 'any' ? null : getMaster(draft.masterId);
  const duration = service.durations.find((d) => d.minutes === draft.durationMinutes) || service.durations[0];
  const happy = isHappyHoursAt(draft.date, draft.time);
  const finalPrice = happy ? applyHappyHoursDiscount(duration.price) : duration.price;
  const dateLabel = (() => {
    if (!draft.date) return '';
    const d = new Date(draft.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (toIsoDate(d) === toIsoDate(today)) return t('booking.today');
    if (toIsoDate(d) === toIsoDate(tomorrow)) return t('booking.tomorrow');
    return `${d.getDate()} ${RU_MONTHS[d.getMonth()]}, ${RU_DOW[d.getDay()]}`;
  })();
  const whenLabel = [dateLabel, draft.time].filter(Boolean).join(', ');

  return (
    <StepShell
      title={t('booking.confirm_booking')}
      onBack={onBack}
      footer={<PrimaryButton onClick={() => onConfirm({ duration, finalPrice, branch, master, dateLabel })}>{t('booking.confirm_cta')}</PrimaryButton>}
    >
      <div
        style={{
          background: colors.deepBrown,
          color: colors.ivory,
          borderRadius: '24px',
          padding: '20px',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -28,
            right: -28,
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: 'rgba(184,121,74,0.18)',
          }}
        />
        <div style={{ ...display, fontSize: 22, marginBottom: 4, position: 'relative' }}>
          {localized(service, 'name')}
        </div>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 16, position: 'relative' }}>
          {duration.minutes} {t('common.minutes_short')} · {branch ? localized(branch, 'name') : ''}
        </div>
        <div style={{ borderTop: '1px solid rgba(240,230,217,0.18)', paddingTop: 12, position: 'relative' }}>
          <SummaryRow label={t('booking.summary_master')} value={master ? localized(master, 'name') : t('booking.any_master')} />
          <SummaryRow label={t('booking.summary_when')} value={whenLabel} />
          <SummaryRow label={t('booking.summary_duration')} value={`${duration.minutes} ${t('common.minutes_short')}`} />
          {draft.visitType && (
            <SummaryRow
              label={t('booking.summary_visit_type')}
              value={draft.visitType === 'party' ? `${t('booking.visit_type_party')} · ${draft.partyPeople}` : t('booking.visit_type_date')}
            />
          )}
          <div style={{ borderTop: '1px solid rgba(240,230,217,0.18)', marginTop: 10, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, opacity: 0.8 }}>{t('booking.summary_total')}</span>
            <div style={{ textAlign: 'right' }}>
              {happy && (
                <div style={{ fontSize: 11, color: 'rgba(240,230,217,0.5)', textDecoration: 'line-through' }}>
                  {formatPrice(duration.price)} {t('common.rub')}
                </div>
              )}
              <div style={{ ...display, fontSize: 22, color: happy ? colors.copper : colors.ivory }}>
                {formatPrice(finalPrice)} {t('common.rub')}
              </div>
              {happy && (
                <div style={{ fontSize: 10, color: colors.copper, fontWeight: 700, letterSpacing: '0.06em' }}>
                  {t('booking.summary_happy_hours')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: colors.cream,
          borderRadius: '16px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Calendar size={16} color={colors.copper} />
        <div style={{ fontSize: 12, color: colors.deepBrown, lineHeight: 1.4 }}>
          {t('booking.reminder_note')}
        </div>
      </div>
    </StepShell>
  );
}

function CourseConfirmStep({ service, draft, onPurchase, onBack }) {
  const { t, localized } = useTranslation();
  const branch = getBranch(draft.branchId);
  return (
    <StepShell
      title={t('booking.course_purchase')}
      onBack={onBack}
      footer={<PrimaryButton onClick={onPurchase}>{t('booking.buy_course_cta')}</PrimaryButton>}
    >
      <div
        style={{
          background: colors.ivory,
          borderRadius: '22px',
          padding: '20px',
          border: `2px solid ${colors.copper}`,
          marginBottom: '14px',
        }}
      >
        <div style={{ ...display, fontSize: '22px', color: colors.deepBrown, marginBottom: 6 }}>
          {localized(service, 'name')}
        </div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 16, lineHeight: 1.45 }}>
          {localized(service, 'description')}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(42,32,25,0.08)', paddingTop: 12 }}>
          <span style={{ fontSize: 12, color: colors.textMuted }}>{branch ? localized(branch, 'name') : ''}</span>
          <span style={{ ...display, fontSize: 24, color: colors.copper }}>
            {formatPrice(service.durations[0].price)} {t('common.rub')}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.5, padding: '0 4px' }}>
        {t('booking.course_purchase_subtitle')}
      </div>
    </StepShell>
  );
}

function TrioModal({ onYes, onNo }) {
  const { t } = useTranslation();
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(26,29,25,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 50,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: colors.ivory,
          borderRadius: '24px',
          padding: '24px',
          maxWidth: '320px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: colors.copperSoft,
            margin: '0 auto 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Users size={22} color={colors.copper} />
        </div>
        <div style={{ ...display, fontSize: '18px', color: colors.deepBrown, marginBottom: 16, lineHeight: 1.3 }}>
          {t('booking.trio_only_satpayeva')}
        </div>
        <button
          onClick={onYes}
          style={{
            ...body,
            background: colors.copper,
            color: colors.ivory,
            border: 'none',
            padding: '14px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%',
            marginBottom: '8px',
          }}
        >
          {t('booking.switch_branch_yes')}
        </button>
        <button
          onClick={onNo}
          style={{
            ...body,
            background: 'transparent',
            color: colors.deepBrown,
            border: '1px solid rgba(42,32,25,0.15)',
            padding: '14px',
            borderRadius: '16px',
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          {t('booking.switch_branch_no')}
        </button>
      </div>
    </div>
  );
}

function nextStepForCourses() {
  return 'course_confirm';
}

function nextStepForRegular(service, draft) {
  if (service.category === 'spa_duo') return 'visit_type';
  if (service.durations.length > 1 && draft.durationMinutes == null) return 'duration';
  return 'master';
}

function nextStepAfterVisitType(service, draft) {
  if (draft.visitType === 'party') return 'party_people';
  if (service.durations.length > 1 && draft.durationMinutes == null) return 'duration';
  return 'master';
}

function nextStepAfterPartyPeople(service, draft) {
  if (service.durations.length > 1 && draft.durationMinutes == null) return 'duration';
  return 'master';
}

export default function BookingScreen() {
  const { t, localized } = useTranslation();
  const { bookingDraft, setBookingDraft, navigate, addBooking, purchaseBackBalance, showToast, resetBookingDraft } = useContext(AppContext);
  const service = getService(bookingDraft.serviceId);

  const initialStep = service ? 'branch' : 'no_service';
  const [history, setHistory] = useState([initialStep]);
  const [showTrioModal, setShowTrioModal] = useState(false);
  const step = history[history.length - 1];

  useEffect(() => {
    if (service && service.durations.length === 1 && bookingDraft.durationMinutes == null) {
      setBookingDraft((prev) => ({ ...prev, durationMinutes: service.durations[0].minutes }));
    }
  }, [service, bookingDraft.durationMinutes, setBookingDraft]);

  const goTo = (name) => setHistory((h) => [...h, name]);
  const goBack = () => {
    if (history.length === 1) {
      navigate('catalog');
      return;
    }
    setHistory((h) => h.slice(0, -1));
  };

  if (!service) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: colors.textMuted }}>
        <div style={{ ...display, fontSize: '20px', color: colors.deepBrown, marginBottom: 12 }}>
          {t('booking.choose_service')}
        </div>
        <button
          onClick={() => navigate('catalog')}
          style={{
            ...body,
            background: colors.copper,
            color: colors.ivory,
            border: 'none',
            padding: '12px 20px',
            borderRadius: '18px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          {t('common.continue')}
        </button>
      </div>
    );
  }

  const handleBranchPick = (branchId) => {
    setBookingDraft((prev) => ({ ...prev, branchId }));
    if (service.category === 'courses') {
      goTo(nextStepForCourses());
    } else {
      goTo(nextStepForRegular(service, bookingDraft));
    }
  };

  const handleVisitTypePick = (visitType) => {
    setBookingDraft((prev) => ({ ...prev, visitType, partyPeople: visitType === 'date' ? null : prev.partyPeople }));
    goTo(nextStepAfterVisitType(service, { ...bookingDraft, visitType }));
  };

  const handlePartyPeoplePick = (n) => {
    if (n === 3 && bookingDraft.branchId === 'nurmagambetova') {
      setShowTrioModal(true);
      return;
    }
    setBookingDraft((prev) => ({ ...prev, partyPeople: n }));
    goTo(nextStepAfterPartyPeople(service, bookingDraft));
  };

  const handleTrioSwitch = () => {
    setBookingDraft((prev) => ({ ...prev, branchId: 'satpayeva', partyPeople: 3 }));
    setShowTrioModal(false);
    goTo(nextStepAfterPartyPeople(service, bookingDraft));
  };

  const handleTrioPickTwo = () => {
    setBookingDraft((prev) => ({ ...prev, partyPeople: 2 }));
    setShowTrioModal(false);
    goTo(nextStepAfterPartyPeople(service, bookingDraft));
  };

  const handleDurationPick = (minutes) => {
    setBookingDraft((prev) => ({ ...prev, durationMinutes: minutes }));
    goTo('master');
  };

  const handleMasterPick = (masterId) => {
    setBookingDraft((prev) => ({ ...prev, masterId }));
    goTo('datetime');
  };

  const handleConfirm = ({ duration, finalPrice, branch, master, dateLabel }) => {
    addBooking({
      serviceId: service.id,
      serviceName: localized(service, 'name'),
      durationMinutes: duration.minutes,
      price: finalPrice,
      masterId: bookingDraft.masterId,
      masterName: master ? localized(master, 'name') : t('booking.any_master'),
      branchId: branch.id,
      branchName: localized(branch, 'name'),
      date: bookingDraft.date,
      time: bookingDraft.time,
    });
    showToast(t('booking.toast_confirmed'));
    resetBookingDraft();
    setHistory(['branch']);
    navigate('home');
  };

  const handleCoursePurchase = () => {
    purchaseBackBalance();
    showToast(t('booking.toast_course_bought'));
    resetBookingDraft();
    setHistory(['branch']);
    navigate('bonus');
  };

  return (
    <>
      {step === 'branch' && (
        <BranchStep service={service} draft={bookingDraft} onBack={goBack} onPick={handleBranchPick} />
      )}
      {step === 'visit_type' && (
        <VisitTypeStep draft={bookingDraft} onBack={goBack} onPick={handleVisitTypePick} />
      )}
      {step === 'party_people' && (
        <PartyPeopleStep draft={bookingDraft} onBack={goBack} onPick={handlePartyPeoplePick} />
      )}
      {step === 'duration' && (
        <DurationStep service={service} draft={bookingDraft} onBack={goBack} onPick={handleDurationPick} />
      )}
      {step === 'master' && (
        <MasterStep draft={bookingDraft} onBack={goBack} onPick={handleMasterPick} />
      )}
      {step === 'datetime' && (
        <DateTimeStep
          draft={bookingDraft}
          onBack={goBack}
          onPickDate={(date) => setBookingDraft((p) => ({ ...p, date }))}
          onPickTime={(time) => setBookingDraft((p) => ({ ...p, time }))}
          onConfirm={() => goTo('confirm')}
        />
      )}
      {step === 'confirm' && (
        <ConfirmStep service={service} draft={bookingDraft} onBack={goBack} onConfirm={handleConfirm} />
      )}
      {step === 'course_confirm' && (
        <CourseConfirmStep service={service} draft={bookingDraft} onBack={goBack} onPurchase={handleCoursePurchase} />
      )}
      {showTrioModal && <TrioModal onYes={handleTrioSwitch} onNo={handleTrioPickTwo} />}
    </>
  );
}
