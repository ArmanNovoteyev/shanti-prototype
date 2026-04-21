import { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import { colors } from '../theme/colors.js';
import { getHeroSlides } from '../data/heroSlides.js';
import { isHappyHoursNow } from '../utils/happyHours.js';
import StoryCircles from '../components/StoryCircles.jsx';
import { FONT_DISPLAY, FONT_BODY, FONT_FAMILY } from '../theme/fonts.js';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.02em' };
const body = { ...FONT_BODY };

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

function HeroSlide({ slide, greetingSub }) {
  const { t } = useTranslation();
  const { navigate } = useContext(AppContext);
  const eyebrow = slide.eyebrowKey ? t(slide.eyebrowKey) : '';
  const title = slide.titleKey ? t(slide.titleKey) : '';
  const sub = slide.subMode === 'greeting' ? greetingSub : slide.subKey ? t(slide.subKey) : '';
  const cta = slide.ctaKey ? t(slide.ctaKey) : null;
  const priceNew = slide.priceNewKey ? t(slide.priceNewKey) : '';
  const priceUnit = slide.priceUnitKey ? t(slide.priceUnitKey) : '';
  const priceOld = slide.priceOldKey ? t(slide.priceOldKey) : '';
  const weekdayPromo = slide.weekdayPromoKey ? t(slide.weekdayPromoKey) : '';
  const hasPriceBlock = Boolean(priceNew);

  const handleCta = (e) => {
    e.stopPropagation();
    if (slide.navigateTo) navigate(slide.navigateTo, slide.payload);
  };

  return (
    <div
      style={{
        flex: '0 0 100%',
        width: '100%',
        height: '100%',
        position: 'relative',
        scrollSnapAlign: 'start',
        backgroundImage: `url(${slide.bg})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        color: colors.ivory,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: slide.overlay,
          pointerEvents: 'none',
        }}
      />
      {hasPriceBlock && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(28,20,16,0.55) 0%, rgba(28,20,16,0.35) 40%, rgba(28,20,16,0) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: 20,
          right: 20,
          color: colors.ivory,
        }}
      >
        {eyebrow && (
          <div
            style={{
              ...body,
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.85,
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </div>
        )}
        <h1
          style={{
            ...display,
            fontSize: hasPriceBlock ? 30 : 40,
            lineHeight: 1.05,
            margin: 0,
            marginBottom: hasPriceBlock ? 10 : sub || cta ? 14 : 0,
          }}
        >
          {title}
        </h1>
        {hasPriceBlock && (
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
              marginBottom: 8,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                ...display,
                fontSize: 36,
                lineHeight: 1,
                color: '#FFF9F0',
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              {priceNew}
            </span>
            {priceUnit && (
              <span style={{ ...body, fontSize: 15, opacity: 0.9 }}>{priceUnit}</span>
            )}
            {priceOld && (
              <span
                style={{
                  ...body,
                  fontSize: 16,
                  opacity: 0.55,
                  textDecoration: 'line-through',
                }}
              >
                {priceOld}
              </span>
            )}
          </div>
        )}
        {sub && (
          <div
            style={{
              ...body,
              fontSize: 15,
              opacity: 0.9,
              marginBottom: weekdayPromo ? 6 : cta ? 18 : 0,
            }}
          >
            {sub}
          </div>
        )}
        {weekdayPromo && (
          <div
            style={{
              ...body,
              fontSize: 13,
              fontWeight: 700,
              color: colors.copper,
              marginBottom: cta ? 18 : 0,
            }}
          >
            {weekdayPromo}
          </div>
        )}
        {cta && (
          <button
            type="button"
            onClick={handleCta}
            style={{
              ...body,
              background: colors.copper,
              color: colors.ivory,
              border: 'none',
              padding: '12px 20px',
              borderRadius: 18,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 10px 24px -12px rgba(184,121,74,0.55)',
            }}
          >
            {cta} →
          </button>
        )}
      </div>
    </div>
  );
}

function Hero() {
  const { t, lang } = useTranslation();
  const { user } = useContext(AppContext);
  const greetingPrefix = t(getGreetingKey());
  const localizedName =
    lang === 'en' ? 'Aigerim' : lang === 'kk' ? 'Айгерім' : user.name;
  const greetingSub = t('home.greeting_with_name', {
    greeting: greetingPrefix,
    name: localizedName,
  });

  const slides = useMemo(() => getHeroSlides(new Date()), []);
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollerRef = useRef(null);
  const autoplayRef = useRef(null);
  const pauseUntilRef = useRef(0);

  const scrollTo = (idx) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setActiveIdx((idx) => {
        const next = (idx + 1) % slides.length;
        const el = scrollerRef.current;
        if (el) el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
        return next;
      });
    }, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [slides.length]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeIdx) setActiveIdx(idx);
  };

  const pauseAutoplay = () => {
    pauseUntilRef.current = Date.now() + 8000;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '62vh',
        minHeight: 480,
        position: 'relative',
        overflow: 'hidden',
        marginTop: -8,
        marginBottom: 20,
        background: colors.deepBrown,
      }}
    >
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onTouchStart={pauseAutoplay}
        onMouseDown={pauseAutoplay}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {slides.map((slide) => (
          <HeroSlide key={slide.id} slide={slide} greetingSub={greetingSub} />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 20,
          right: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            ...display,
            fontSize: '17px',
            letterSpacing: '0.32em',
            color: colors.ivory,
          }}
        >
          SHANTI
        </div>
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(240,230,217,0.12)',
            border: '1px solid rgba(240,230,217,0.28)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            pointerEvents: 'auto',
          }}
          aria-label="notifications"
        >
          <Bell size={17} color={colors.ivory} strokeWidth={1.7} />
          <span
            style={{
              position: 'absolute',
              top: 9,
              right: 10,
              width: 7,
              height: 7,
              background: colors.copper,
              borderRadius: '50%',
              border: `2px solid rgba(42,32,25,0.4)`,
            }}
          />
        </button>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 20,
          right: 20,
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          pointerEvents: 'none',
        }}
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              pauseAutoplay();
              setActiveIdx(i);
              scrollTo(i);
            }}
            aria-label={`slide ${i + 1}`}
            style={{
              pointerEvents: 'auto',
              width: i === activeIdx ? 22 : 6,
              height: 6,
              borderRadius: 3,
              border: 'none',
              padding: 0,
              background: i === activeIdx ? colors.ivory : 'rgba(240,230,217,0.45)',
              transition: 'width 0.3s ease, background 0.3s ease',
              cursor: 'pointer',
            }}
          />
        ))}
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
          background: colors.ivory,
          border: `1px solid ${colors.copperSoft}`,
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
            background: colors.copperSoft,
            color: colors.copper,
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
              <span style={{ ...display, fontSize: 18, color: colors.deepBrown, lineHeight: 1 }}>
                {balanceStr}
              </span>
              <span style={{ fontSize: 11, color: colors.textMuted }}>
                {t('bonus.teaser_unit')}
              </span>
            </div>
            <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 3 }}>
              {t('bonus.teaser_rate')}
            </div>
          </div>

          {hasCourse && (
            <>
              <div
                style={{
                  width: 1,
                  alignSelf: 'stretch',
                  background: 'rgba(42,32,25,0.1)',
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
                    color: colors.deepBrown,
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap' }}>{t('bonus.back_balance_title')}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: colors.copper,
                      background: colors.copperSoft,
                      padding: '1px 7px',
                      borderRadius: 7,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {backBalance.done}/{backBalance.total}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 3 }}>
                  {t('bonus.teaser_sub')}
                </div>
              </div>
            </>
          )}
        </div>

        <ChevronRight size={18} color={colors.textMuted} style={{ flexShrink: 0 }} />
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
            background: colors.cream,
            borderRadius: '24px',
            padding: '22px',
            border: '1px dashed rgba(42,32,25,0.15)',
            textAlign: 'center',
          }}
        >
          <div style={{ ...display, fontSize: '20px', color: colors.deepBrown, marginBottom: '6px' }}>
            {t('home.no_visits')}
          </div>
          <div style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '14px' }}>
            {t('home.no_visits_cta')}
          </div>
          <button
            onClick={() => navigate('catalog')}
            style={{
              ...body,
              background: colors.copper,
              color: colors.ivory,
              border: 'none',
              padding: '10px 20px',
              borderRadius: '18px',
              fontSize: '13px',
              fontWeight: 700,
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
          background: colors.deepBrown,
          borderRadius: '28px',
          padding: '22px',
          color: colors.ivory,
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
            borderTop: '1px solid rgba(240,230,217,0.15)',
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
              background: colors.copper,
              color: colors.ivory,
              border: 'none',
              padding: '7px 14px',
              borderRadius: '18px',
              fontSize: '12px',
              fontWeight: 700,
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
          background: colors.copper,
          color: colors.ivory,
          border: 'none',
          padding: '17px',
          borderRadius: '20px',
          fontSize: '15px',
          fontWeight: 700,
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
  const { navigate } = useContext(AppContext);
  const active = isHappyHoursNow();
  return (
    <div style={{ padding: '0 24px', marginBottom: '16px' }}>
      <button
        type="button"
        onClick={() => navigate('happy_hours')}
        style={{
          ...body,
          width: '100%',
          textAlign: 'left',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '22px',
          padding: '18px 20px',
          background: active
            ? `linear-gradient(120deg, ${colors.copper} 0%, #D08C56 100%)`
            : colors.copperSoft,
          color: active ? colors.ivory : colors.deepBrown,
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
            background: active ? 'rgba(240,230,217,0.18)' : colors.ivory,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Clock size={18} color={active ? colors.ivory : colors.copper} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 700,
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
      </button>
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
          background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.sand} 100%)`,
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
            background: colors.deepBrown,
            color: colors.ivory,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Gift size={20} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...display, fontSize: '17px', color: colors.deepBrown, lineHeight: 1.2 }}>
            {t('home.gift_banner_title')}
          </div>
          <div style={{ fontSize: '12px', color: colors.deepBrown, opacity: 0.7, marginTop: '2px' }}>
            {t('home.gift_banner_subtitle')}
          </div>
        </div>
        <ChevronRight size={18} color={colors.deepBrown} />
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
        background: colors.ivory,
        borderRadius: '20px',
        padding: '18px',
        border: '1px solid rgba(42,32,25,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ ...display, fontSize: '15px', color: colors.deepBrown }}>{review.author}</div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} size={11} fill={colors.copper} color={colors.copper} />
          ))}
        </div>
      </div>
      <div style={{ fontSize: '12px', color: colors.textMain, lineHeight: 1.45, flex: 1 }}>{text}</div>
      <div style={{ fontSize: '11px', color: colors.textMuted, display: 'flex', justifyContent: 'space-between' }}>
        <span>{review.service}</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
}

function ReviewsCarousel() {
  const { t } = useTranslation();
  const { navigate } = useContext(AppContext);
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
        <div style={{ ...display, fontSize: '20px', color: colors.deepBrown }}>
          {t('home.reviews_title')}
        </div>
        <button
          type="button"
          onClick={() => navigate('reviews')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: '12px',
            color: colors.copper,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: FONT_FAMILY,
          }}
        >
          {t('home.reviews_all')}
        </button>
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
          background: colors.ivory,
          borderRadius: '22px',
          padding: '20px',
          border: '1px solid rgba(42,32,25,0.06)',
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
          <Sparkles size={16} color={colors.copper} />
          <div style={{ ...display, fontSize: '17px', color: colors.deepBrown }}>
            {t('home.social_proof_title')}
          </div>
        </div>
        <div style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '14px' }}>
          {t('home.social_proof_subtitle')}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {branches.map((b) => (
            <div
              key={b.id}
              style={{
                flex: 1,
                background: colors.cream,
                borderRadius: '14px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  ...display,
                  fontSize: '20px',
                  color: colors.deepBrown,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                {b.rating}
                <Star size={13} fill={colors.copper} color={colors.copper} />
              </div>
              <div style={{ fontSize: '10px', color: colors.textMuted, marginTop: '4px' }}>
                {t(`home.social_proof_branch_${b.id}`)}
              </div>
              <div style={{ fontSize: '10px', color: colors.textMuted }}>
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
      <Hero />
      <StoryCircles />
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
