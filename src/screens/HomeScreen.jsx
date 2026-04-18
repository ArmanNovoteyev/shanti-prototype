import { useContext } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  Gift,
  Star,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { reviews } from '../data/reviews.js';
import { branches } from '../data/branches.js';

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

const display = { fontFamily: "'Fraunces', serif", fontWeight: 500, letterSpacing: '-0.02em' };
const body = { fontFamily: "'Manrope', sans-serif" };

const RU_MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const RU_DOW = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

function formatDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]}, ${RU_DOW[d.getDay()]}`;
}

function getGreetingKey(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'home.greeting_morning';
  if (h >= 12 && h < 18) return 'home.greeting_day';
  return 'home.greeting_evening';
}

function isHappyHoursNow(date = new Date()) {
  const day = date.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const h = date.getHours();
  return isWeekday && h >= 11 && h < 14;
}

function LogoMark() {
  // TODO: swap to <img src="/assets/logo/shanti-logo-on-light.png" /> once asset lands
  return (
    <div
      style={{
        ...display,
        fontSize: '17px',
        letterSpacing: '0.32em',
        color: tokens.deepSage,
        fontWeight: 600,
      }}
    >
      SHANTI
    </div>
  );
}

function Header() {
  const { t, lang } = useTranslation();
  const { user } = useContext(AppContext);
  const greetingPrefix = t(getGreetingKey());
  const localizedName =
    lang === 'en' ? 'Aigerim' : lang === 'kk' ? 'Айгерім' : user.name;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 24px 20px',
      }}
    >
      <LogoMark />
      <div style={{ flex: 1, textAlign: 'right', marginRight: '12px' }}>
        <div style={{ fontSize: '11px', color: tokens.muted, letterSpacing: '0.04em' }}>
          {t('home.greeting_with_name', { greeting: greetingPrefix, name: localizedName })}
        </div>
      </div>
      <button
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: tokens.ivory,
          border: '1px solid rgba(42,46,40,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
        aria-label="notifications"
      >
        <Bell size={17} color={tokens.deepSage} strokeWidth={1.7} />
        <span
          style={{
            position: 'absolute',
            top: 9,
            right: 10,
            width: 7,
            height: 7,
            background: tokens.copper,
            borderRadius: '50%',
            border: `2px solid ${tokens.ivory}`,
          }}
        />
      </button>
    </div>
  );
}

function Hero() {
  const { t } = useTranslation();
  // TODO: replace gradient with <img src="/assets/photos/01-hero.jpg" /> when ready
  return (
    <div style={{ padding: '0 24px', marginBottom: '20px' }}>
      <div
        style={{
          height: '210px',
          borderRadius: '28px',
          overflow: 'hidden',
          position: 'relative',
          background: `radial-gradient(120% 100% at 20% 10%, ${tokens.sage} 0%, ${tokens.deepSage} 50%, ${tokens.copper} 130%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '22px',
          color: tokens.ivory,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(251,248,241,0.08)',
            border: '1px solid rgba(251,248,241,0.15)',
          }}
        />
        <div style={{ position: 'relative' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.85,
              marginBottom: '8px',
            }}
          >
            {t('home.hero_eyebrow')}
          </div>
          <div
            style={{
              ...display,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '36px',
              lineHeight: 1,
            }}
          >
            {t('home.hero_title')}
          </div>
        </div>
      </div>
    </div>
  );
}

function BonusTeaser() {
  const { t } = useTranslation();
  const { bonus, backBalance, navigate } = useContext(AppContext);
  const balanceStr = Number(bonus.balance).toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
  const hasCourse = !!backBalance?.purchased;
  return (
    <div style={{ padding: '0 20px', marginBottom: 14 }}>
      <button
        onClick={() => navigate('bonus')}
        style={{
          ...body,
          width: '100%',
          background: tokens.ivory,
          border: `1px solid ${tokens.copperSoft}`,
          borderRadius: 20,
          padding: '13px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          textAlign: 'left',
          boxShadow: '0 8px 18px -12px rgba(184,121,74,0.28)',
        }}
        aria-label={t('bonus.title')}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: tokens.copperSoft,
            color: tokens.copper,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Sparkles size={18} strokeWidth={2} />
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ flex: hasCourse ? '0 0 auto' : 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ ...display, fontSize: 18, color: tokens.deepSage, lineHeight: 1 }}>
                {balanceStr}
              </span>
              <span style={{ fontSize: 11, color: tokens.muted, fontWeight: 600 }}>
                {t('bonus.teaser_unit')}
              </span>
            </div>
            <div style={{ fontSize: 11, color: tokens.muted, marginTop: 3 }}>
              {t('bonus.teaser_rate')}
            </div>
          </div>

          {hasCourse && (
            <>
              <div
                style={{
                  width: 1,
                  alignSelf: 'stretch',
                  background: 'rgba(42,46,40,0.1)',
                  margin: '2px 0',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: tokens.deepSage,
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap' }}>{t('bonus.back_balance_title')}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: tokens.copper,
                      background: tokens.copperSoft,
                      padding: '1px 7px',
                      borderRadius: 7,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {backBalance.done}/{backBalance.total}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: tokens.muted, marginTop: 3 }}>
                  {t('bonus.teaser_sub')}
                </div>
              </div>
            </>
          )}
        </div>

        <ChevronRight size={18} color={tokens.muted} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

function NextVisitCard() {
  const { t, localized } = useTranslation();
  const { bookings, navigate } = useContext(AppContext);
  const next = bookings[0];

  if (!next) {
    return (
      <div style={{ padding: '0 24px', marginBottom: '20px' }}>
        <div
          style={{
            background: tokens.cream,
            borderRadius: '24px',
            padding: '22px',
            border: '1px dashed rgba(42,46,40,0.15)',
            textAlign: 'center',
          }}
        >
          <div style={{ ...display, fontSize: '20px', color: tokens.deepSage, marginBottom: '6px' }}>
            {t('home.no_visits')}
          </div>
          <div style={{ fontSize: '13px', color: tokens.muted, marginBottom: '14px' }}>
            {t('home.no_visits_cta')}
          </div>
          <button
            onClick={() => navigate('catalog')}
            style={{
              ...body,
              background: tokens.copper,
              color: tokens.ivory,
              border: 'none',
              padding: '10px 20px',
              borderRadius: '18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('common.book')}
          </button>
        </div>
      </div>
    );
  }

  const branch = branches.find((b) => b.id === next.branchId);
  const branchName = branch ? localized(branch, 'name') : next.branchName;

  return (
    <div style={{ padding: '0 24px', marginBottom: '20px' }}>
      <div
        style={{
          background: tokens.deepSage,
          borderRadius: '28px',
          padding: '22px',
          color: tokens.ivory,
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
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            opacity: 0.7,
            marginBottom: '10px',
          }}
        >
          {t('home.next_visit')}
        </div>
        <div style={{ ...display, fontSize: '24px', marginBottom: '4px', lineHeight: 1.15 }}>
          {next.serviceName}
        </div>
        <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '16px' }}>
          {next.masterName} · {next.durationMinutes} {t('common.minutes_short')}
        </div>
        <div style={{ display: 'flex', gap: '14px', fontSize: '13px', position: 'relative' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} /> {formatDateShort(next.date)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} /> {next.time}
          </span>
        </div>
        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(251,248,241,0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '12px', opacity: 0.75 }}>{branchName}</span>
          <button
            onClick={() => navigate('bookings')}
            style={{
              ...body,
              background: tokens.copper,
              color: tokens.ivory,
              border: 'none',
              padding: '7px 14px',
              borderRadius: '18px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('home.details')}
          </button>
        </div>
      </div>
    </div>
  );
}

function PrimaryCTA() {
  const { t } = useTranslation();
  const { navigate } = useContext(AppContext);
  return (
    <div style={{ padding: '0 24px', marginBottom: '24px' }}>
      <button
        onClick={() => navigate('catalog')}
        style={{
          ...body,
          width: '100%',
          background: tokens.copper,
          color: tokens.ivory,
          border: 'none',
          padding: '17px',
          borderRadius: '20px',
          fontSize: '15px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 10px 24px -10px rgba(184,121,74,0.55)',
        }}
      >
        <Calendar size={17} /> {t('home.quick_book')}
      </button>
    </div>
  );
}

function HappyHoursBanner() {
  const { t } = useTranslation();
  const active = isHappyHoursNow();
  return (
    <div style={{ padding: '0 24px', marginBottom: '16px' }}>
      <div
        style={{
          borderRadius: '22px',
          padding: '18px 20px',
          background: active
            ? `linear-gradient(120deg, ${tokens.copper} 0%, #D08C56 100%)`
            : tokens.copperSoft,
          color: active ? tokens.ivory : tokens.deepSage,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: active ? 'rgba(251,248,241,0.18)' : tokens.ivory,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Clock size={18} color={active ? tokens.ivory : tokens.copper} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '4px',
              opacity: active ? 0.95 : 0.65,
            }}
          >
            {active ? t('home.happy_hours_active_eyebrow') : t('home.happy_hours_title')}
          </div>
          <div style={{ ...display, fontSize: '15px', lineHeight: 1.25 }}>
            {active ? t('home.happy_hours_active') : t('home.happy_hours_subtitle')}
          </div>
        </div>
      </div>
    </div>
  );
}

function GiftBanner() {
  const { t } = useTranslation();
  const { navigate } = useContext(AppContext);
  return (
    <div style={{ padding: '0 24px', marginBottom: '24px' }}>
      <button
        onClick={() => navigate('gift')}
        style={{
          ...body,
          width: '100%',
          textAlign: 'left',
          background: 'linear-gradient(135deg, #E8DDC8 0%, #D4C4A8 100%)',
          border: 'none',
          borderRadius: '22px',
          padding: '18px 20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: tokens.deepSage,
            color: tokens.ivory,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Gift size={20} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...display, fontSize: '17px', color: tokens.deepSage, lineHeight: 1.2 }}>
            {t('home.gift_banner_title')}
          </div>
          <div style={{ fontSize: '12px', color: tokens.deepSage, opacity: 0.7, marginTop: '2px' }}>
            {t('home.gift_banner_subtitle')}
          </div>
        </div>
        <ChevronRight size={18} color={tokens.deepSage} />
      </button>
    </div>
  );
}

function ReviewCard({ review }) {
  const text =
    review.text_ru.length > 160
      ? review.text_ru.slice(0, 160).trimEnd() + '…'
      : review.text_ru;
  return (
    <div
      style={{
        flexShrink: 0,
        width: '260px',
        background: tokens.ivory,
        borderRadius: '20px',
        padding: '18px',
        border: '1px solid rgba(42,46,40,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ ...display, fontSize: '15px', color: tokens.deepSage }}>{review.author}</div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} size={11} fill={tokens.copper} color={tokens.copper} />
          ))}
        </div>
      </div>
      <div style={{ fontSize: '12px', color: tokens.text, lineHeight: 1.45, flex: 1 }}>{text}</div>
      <div style={{ fontSize: '11px', color: tokens.muted, display: 'flex', justifyContent: 'space-between' }}>
        <span>{review.service}</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
}

function ReviewsCarousel() {
  const { t } = useTranslation();
  const items = reviews.slice(0, 5);
  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          padding: '0 24px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ ...display, fontSize: '20px', color: tokens.deepSage }}>
          {t('home.reviews_title')}
        </div>
        <span style={{ fontSize: '12px', color: tokens.muted }}>{t('home.reviews_all')}</span>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          padding: '4px 24px 8px',
          scrollSnapType: 'x mandatory',
        }}
      >
        {items.map((r) => (
          <div key={r.id} style={{ scrollSnapAlign: 'start' }}>
            <ReviewCard review={r} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialProof() {
  const { t } = useTranslation();
  return (
    <div style={{ padding: '0 24px', marginBottom: '8px' }}>
      <div
        style={{
          background: tokens.ivory,
          borderRadius: '22px',
          padding: '20px',
          border: '1px solid rgba(42,46,40,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
          }}
        >
          <Sparkles size={16} color={tokens.copper} />
          <div style={{ ...display, fontSize: '17px', color: tokens.deepSage }}>
            {t('home.social_proof_title')}
          </div>
        </div>
        <div style={{ fontSize: '13px', color: tokens.muted, marginBottom: '14px' }}>
          {t('home.social_proof_subtitle')}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {branches.map((b) => (
            <div
              key={b.id}
              style={{
                flex: 1,
                background: tokens.cream,
                borderRadius: '14px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  ...display,
                  fontSize: '20px',
                  color: tokens.deepSage,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                {b.rating}
                <Star size={13} fill={tokens.copper} color={tokens.copper} />
              </div>
              <div style={{ fontSize: '10px', color: tokens.muted, marginTop: '4px' }}>
                {t(`home.social_proof_branch_${b.id}`)}
              </div>
              <div style={{ fontSize: '10px', color: tokens.muted }}>
                {b.reviews_count} отзывов
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeScreen() {
  return (
    <div>
      <Header />
      <Hero />
      <NextVisitCard />
      <BonusTeaser />
      <PrimaryCTA />
      <HappyHoursBanner />
      <GiftBanner />
      <ReviewsCarousel />
      <SocialProof />
    </div>
  );
}
