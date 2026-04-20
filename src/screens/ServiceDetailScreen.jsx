import { useContext, useMemo } from 'react';
import { ChevronLeft, Heart, Flame, Star, Check, Clock } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { getService } from '../data/services.js';
import { getServicePhoto } from '../data/servicePhotos.js';
import { masters } from '../data/masters.js';
import { reviews } from '../data/reviews.js';
import { colors } from '../theme/colors.js';
import ServiceStages from '../components/ServiceStages.jsx';
import { applyHappyHoursDiscount } from '../utils/happyHours.js';
import { FONT_DISPLAY, FONT_BODY } from '../theme/fonts.js';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.02em' };
const body = { ...FONT_BODY };

const DEFAULT_DESCRIPTIONS = {
  massage: 'Традиционная тайская техника, выполненная сертифицированным мастером.',
  spa_solo: 'Полная программа ухода за телом и душой.',
  spa_duo: 'Парная программа для двоих в отдельном зале.',
  special: 'Специальная программа с учётом ваших потребностей.',
  courses: 'Курс из нескольких визитов с трекингом результата.',
};

function formatPrice(v) {
  return v.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
}

function Eyebrow({ children }) {
  return (
    <div
      style={{
        ...body,
        fontSize: 11,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: colors.deepBrown,
        fontWeight: 700,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function HeroSection({ service }) {
  const { navigate } = useContext(AppContext);
  const { t } = useTranslation();
  const photo = getServicePhoto(service);
  const badges = [];
  if (service.category === 'spa_duo') {
    badges.push({ icon: <Heart size={11} fill={colors.copper} color={colors.copper} />, label: t('catalog.badge_duo') });
  }
  if (service.hasHerbalBarrel) {
    badges.push({ icon: <Flame size={11} color={colors.copper} />, label: t('catalog.badge_herbal') });
  }
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 240,
        marginTop: -8,
        backgroundImage: `url(${photo})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 45%',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(42,32,25,0.05) 0%, rgba(42,32,25,0.45) 100%)',
        }}
      />
      <button
        onClick={() => navigate('catalog')}
        aria-label="back"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: colors.ivory,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 6px 14px -6px rgba(42,32,25,0.4)',
        }}
      >
        <ChevronLeft size={20} color={colors.deepBrown} />
      </button>
      {badges.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 16,
            bottom: 16,
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          {badges.map((b, i) => (
            <span
              key={i}
              style={{
                ...body,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: colors.ivory,
                color: colors.copper,
                padding: '5px 10px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              {b.icon}
              {b.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function HappyHoursPill() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        margin: '16px 24px 0',
        padding: '10px 14px',
        borderRadius: 14,
        background: colors.copperSoft,
        color: colors.copper,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Clock size={16} color={colors.copper} strokeWidth={2.2} />
      <span style={{ ...body, fontSize: 13, fontWeight: 700, letterSpacing: '0.01em' }}>
        {t('happyHours.detailBadge')}
      </span>
    </div>
  );
}

function TitleAndDesc({ service }) {
  const { localized } = useTranslation();
  const desc = localized(service, 'description') || DEFAULT_DESCRIPTIONS[service.category] || '';
  return (
    <div style={{ padding: '20px 24px 0' }}>
      <h1
        style={{
          ...display,
          fontSize: 32,
          color: colors.deepBrown,
          margin: 0,
          marginBottom: 10,
          lineHeight: 1.1,
        }}
      >
        {localized(service, 'name')}
      </h1>
      <p
        style={{
          ...body,
          fontSize: 15,
          color: colors.textMuted,
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function IncludedSection() {
  const { t } = useTranslation();
  const items = t('service_detail.included.items');
  const list = Array.isArray(items) ? items : [];
  return (
    <div
      style={{
        margin: '28px 24px 0',
        paddingTop: 20,
        borderTop: `1px solid ${colors.sand}`,
      }}
    >
      <div
        style={{
          ...body,
          fontSize: 12,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: colors.textMuted,
          fontWeight: 700,
          marginBottom: 14,
        }}
      >
        {t('service_detail.included.title')}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Check size={14} color={colors.copper} strokeWidth={2.4} style={{ marginTop: 4, flexShrink: 0 }} />
            <span style={{ ...body, fontSize: 14, color: colors.textMain, lineHeight: 1.45 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriceRow({ label, price, isHappy }) {
  const { t } = useTranslation();
  if (!isHappy) {
    return (
      <>
        <span style={{ ...body, fontSize: 15, color: colors.textMain }}>{label}</span>
        <span style={{ ...display, fontSize: 18, color: colors.copper }}>
          {formatPrice(price)} {t('common.rub')}
        </span>
      </>
    );
  }
  const discounted = applyHappyHoursDiscount(price);
  return (
    <>
      <span style={{ ...body, fontSize: 15, color: colors.textMain }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span
          style={{
            ...body,
            fontSize: 13,
            color: colors.textMuted,
            textDecoration: 'line-through',
          }}
        >
          {formatPrice(price)}
        </span>
        <span style={{ ...display, fontSize: 18, color: colors.copper }}>
          {formatPrice(discounted)} {t('common.rub')}
        </span>
      </span>
    </>
  );
}

function PriceSection({ service, isHappy }) {
  const { t } = useTranslation();
  const isCourse = service.category === 'courses';
  return (
    <div style={{ padding: '28px 24px 0' }}>
      <Eyebrow>{t('service_detail.duration_price')}</Eyebrow>
      <div>
        {isCourse ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '12px 0',
            }}
          >
            <PriceRow label="Курс 5 процедур" price={service.durations[0].price} isHappy={isHappy} />
          </div>
        ) : (
          service.durations.map((d, i) => (
            <div
              key={d.minutes}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '12px 0',
                borderBottom: i < service.durations.length - 1 ? `1px solid ${colors.cream}` : 'none',
              }}
            >
              <PriceRow
                label={`${d.minutes} ${t('common.minutes_short')}`}
                price={d.price}
                isHappy={isHappy}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MasterCard({ master }) {
  const { t, localized } = useTranslation();
  const name = localized(master, 'name');
  return (
    <div
      style={{
        flexShrink: 0,
        width: 140,
        background: colors.ivory,
        border: `1px solid ${colors.cream}`,
        borderRadius: 16,
        padding: 16,
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: colors.deepBrown,
          color: colors.ivory,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...display,
          fontSize: 22,
        }}
      >
        {name.charAt(0)}
      </div>
      <div style={{ ...display, fontSize: 16, color: colors.textMain, lineHeight: 1.1 }}>{name}</div>
      <div style={{ ...body, fontSize: 12, color: colors.textMuted }}>
        {t('service_detail.years_experience', { n: master.experience_years })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: colors.copper, fontSize: 14 }}>
        <Star size={14} fill={colors.copper} color={colors.copper} /> {master.rating}
      </div>
    </div>
  );
}

function MastersSection() {
  const { t } = useTranslation();
  return (
    <div style={{ padding: '28px 0 0' }}>
      <div style={{ padding: '0 24px' }}>
        <Eyebrow>{t('service_detail.masters')}</Eyebrow>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          padding: '0 24px 8px',
          scrollSnapType: 'x mandatory',
        }}
      >
        {masters.map((m) => (
          <MasterCard key={m.id} master={m} />
        ))}
      </div>
    </div>
  );
}

function ServiceReviewsSection({ service }) {
  const { t, localized } = useTranslation();
  const { navigate } = useContext(AppContext);
  const related = useMemo(() => {
    const name = localized(service, 'name').toLowerCase();
    const firstWord = name.split(' ')[0];
    if (!firstWord) return [];
    return reviews
      .filter((r) => r.service && r.service.toLowerCase().includes(firstWord))
      .slice(0, 2);
  }, [service, localized]);

  if (related.length === 0) return null;

  return (
    <div style={{ padding: '28px 24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <Eyebrow>{t('service_detail.reviews_about')}</Eyebrow>
        <button
          type="button"
          onClick={() => navigate('reviews')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: colors.copper,
            fontWeight: 700,
            fontSize: 12,
            cursor: 'pointer',
            ...body,
          }}
        >
          {t('service_detail.all_reviews')} →
        </button>
      </div>
      {related.map((r) => {
        const text = r.text_ru.length > 160 ? r.text_ru.slice(0, 160).trimEnd() + '…' : r.text_ru;
        return (
          <div
            key={r.id}
            style={{
              background: colors.ivory,
              border: `1px solid ${colors.cream}`,
              borderRadius: 16,
              padding: 16,
              marginBottom: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ ...display, fontSize: 15, color: colors.deepBrown }}>{r.author}</div>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={11} fill={colors.copper} color={colors.copper} />
                ))}
              </div>
            </div>
            <div style={{ ...body, fontSize: 13, color: colors.textMain, lineHeight: 1.45 }}>{text}</div>
            <div style={{ ...body, fontSize: 11, color: colors.textMuted, marginTop: 8 }}>{r.date}</div>
          </div>
        );
      })}
    </div>
  );
}

function StickyCTA({ service, isHappy }) {
  const { t } = useTranslation();
  const { startBookingFor } = useContext(AppContext);
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        marginTop: 32,
        paddingTop: 40,
        background: `linear-gradient(0deg, ${colors.ivory} 60%, rgba(240,230,217,0) 100%)`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '0 24px 16px',
          background: colors.ivory,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={() => startBookingFor(service.id, isHappy ? { happyHours: true } : {})}
          style={{
            ...body,
            width: '100%',
            background: colors.copper,
            color: colors.white,
            border: 'none',
            height: 56,
            borderRadius: 28,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 12px 28px -12px rgba(184,121,74,0.6)',
          }}
        >
          {t('service_detail.cta')}
        </button>
      </div>
    </div>
  );
}

export default function ServiceDetailScreen() {
  const { bookingDraft, navigate } = useContext(AppContext);
  const service = getService(bookingDraft.serviceId);
  const isHappy = bookingDraft.happyHours === true;

  if (!service) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ ...display, fontSize: 18, color: colors.deepBrown, marginBottom: 12 }}>
          Услуга не найдена
        </div>
        <button
          onClick={() => navigate('catalog')}
          style={{
            ...body,
            background: colors.copper,
            color: colors.ivory,
            border: 'none',
            padding: '12px 20px',
            borderRadius: 18,
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          В каталог
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeroSection service={service} />
      {isHappy && <HappyHoursPill />}
      <TitleAndDesc service={service} />
      <ServiceStages stages={service.stages} />
      <IncludedSection />
      <PriceSection service={service} isHappy={isHappy} />
      <MastersSection />
      <ServiceReviewsSection service={service} />
      <StickyCTA service={service} isHappy={isHappy} />
    </div>
  );
}
