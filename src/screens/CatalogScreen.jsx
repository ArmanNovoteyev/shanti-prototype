import { useContext, useState, useMemo } from 'react';
import { Clock, Flame, Heart, ChevronRight, Award } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { services, SERVICE_CATEGORIES } from '../data/services.js';
import { subscriptions } from '../data/subscriptions.js';
import SubscriptionCard from '../components/SubscriptionCard.jsx';
import { colors } from '../theme/colors.js';

const display = { fontFamily: "'Fraunces', serif", fontWeight: 500, letterSpacing: '-0.02em' };
const body = { fontFamily: "'Manrope', sans-serif" };

function formatPrice(value) {
  return value.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
}

function CategoryTabs({ active, onChange }) {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '0 24px 6px',
        marginBottom: '20px',
      }}
    >
      {SERVICE_CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            style={{
              ...body,
              padding: '10px 16px',
              borderRadius: '20px',
              background: isActive ? colors.deepBrown : 'transparent',
              color: isActive ? colors.ivory : colors.deepBrown,
              border: isActive ? 'none' : '1px solid rgba(42,32,25,0.15)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {t(`categories.${cat}`)}
          </button>
        );
      })}
    </div>
  );
}

function PriceRange({ durations }) {
  const { t } = useTranslation();
  const min = Math.min(...durations.map((d) => d.price));
  if (durations.length === 1) {
    return (
      <div style={{ ...display, fontSize: '17px', color: colors.copper, whiteSpace: 'nowrap' }}>
        {formatPrice(min)} {t('common.rub')}
      </div>
    );
  }
  return (
    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
      <div style={{ fontSize: '10px', color: colors.textMuted, letterSpacing: '0.04em', marginBottom: '2px' }}>
        {t('catalog.from_price')}
      </div>
      <div style={{ ...display, fontSize: '17px', color: colors.copper }}>
        {formatPrice(min)} {t('common.rub')}
      </div>
    </div>
  );
}

function DurationChips({ durations }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      <Clock size={12} color={colors.textMuted} />
      {durations.map((d, i) => (
        <span
          key={d.minutes}
          style={{
            fontSize: '11px',
            color: colors.deepBrown,
            background: colors.cream,
            padding: '3px 8px',
            borderRadius: '10px',
            fontWeight: 500,
          }}
        >
          {d.minutes} {t('common.minutes_short')}
          {i < durations.length - 1 ? '' : ''}
        </span>
      ))}
    </div>
  );
}

function ServiceBadges({ service }) {
  const { t } = useTranslation();
  const items = [];
  if (service.category === 'spa_duo') {
    items.push({
      key: 'duo',
      icon: <Heart size={11} fill={colors.copper} color={colors.copper} />,
      label: t('catalog.badge_duo'),
    });
  }
  if (service.hasHerbalBarrel) {
    items.push({
      key: 'herbal',
      icon: <Flame size={11} color={colors.copper} />,
      label: t('catalog.badge_herbal'),
    });
  }
  if (!items.length) return null;
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
      {items.map((it) => (
        <span
          key={it.key}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: colors.copperSoft,
            color: colors.copper,
            padding: '3px 8px',
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {it.icon}
          {it.label}
        </span>
      ))}
    </div>
  );
}

function ServiceCard({ service }) {
  const { t, localized } = useTranslation();
  const { navigate } = useContext(AppContext);
  return (
    <button
      onClick={() => navigate('service', { serviceId: service.id })}
      style={{
        ...body,
        textAlign: 'left',
        background: colors.ivory,
        borderRadius: '20px',
        padding: '18px',
        marginBottom: '12px',
        border: '1px solid rgba(42,32,25,0.06)',
        cursor: 'pointer',
        width: '100%',
        display: 'block',
      }}
    >
      <ServiceBadges service={service} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '6px',
        }}
      >
        <div style={{ ...display, fontSize: '17px', color: colors.deepBrown, lineHeight: 1.2, flex: 1 }}>
          {localized(service, 'name')}
        </div>
        <PriceRange durations={service.durations} />
      </div>
      <div
        style={{
          fontSize: '12px',
          color: colors.textMuted,
          lineHeight: 1.4,
          marginBottom: '12px',
        }}
      >
        {localized(service, 'subtitle') || localized(service, 'description')}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DurationChips durations={service.durations} />
        <ChevronRight size={16} color={colors.copper} />
      </div>
    </button>
  );
}

function CourseCard({ service }) {
  const { t, localized } = useTranslation();
  const { navigate } = useContext(AppContext);
  const openDetail = () => navigate('service', { serviceId: service.id });
  return (
    <div
      onClick={openDetail}
      role="button"
      style={{
        background: colors.ivory,
        borderRadius: '22px',
        padding: '20px',
        marginBottom: '12px',
        border: `2px solid ${colors.copper}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          background: colors.copper,
          color: colors.ivory,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          padding: '4px 10px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Award size={11} />
        {t('catalog.badge_subscription')}
      </div>
      <div
        style={{
          ...display,
          fontSize: '20px',
          color: colors.deepBrown,
          marginBottom: '6px',
          paddingRight: '110px',
          lineHeight: 1.2,
        }}
      >
        {localized(service, 'name')}
      </div>
      <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '14px', lineHeight: 1.45 }}>
        {localized(service, 'description')}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.04em' }}>
            {t('catalog.course_subtitle')}
          </div>
          <div style={{ ...display, fontSize: '22px', color: colors.copper }}>
            {formatPrice(service.durations[0].price)} {t('common.rub')}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDetail();
          }}
          style={{
            ...body,
            background: colors.copper,
            color: colors.ivory,
            border: 'none',
            padding: '12px 18px',
            borderRadius: '18px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 18px -8px rgba(184,121,74,0.55)',
          }}
        >
          {t('catalog.course_buy')}
        </button>
      </div>
    </div>
  );
}

function SubsectionEyebrow({ children }) {
  return (
    <div
      style={{
        ...body,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: colors.textMuted,
        textTransform: 'uppercase',
        margin: '4px 2px 12px',
      }}
    >
      {children}
    </div>
  );
}

export default function CatalogScreen() {
  const { t } = useTranslation();
  const { navigate } = useContext(AppContext);
  const [category, setCategory] = useState('massage');

  const list = useMemo(() => services.filter((s) => s.category === category), [category]);

  const isCourses = category === 'courses';
  const coursesList = useMemo(
    () => services.filter((s) => s.category === 'courses' && s.isSubscription),
    [],
  );

  const startSubscriptionPurchase = (sub) =>
    navigate('subscription_purchase', { subscriptionId: sub.id });

  return (
    <div>
      <div style={{ padding: '4px 24px 4px' }}>
        <div style={{ ...display, fontSize: '30px', color: colors.deepBrown, lineHeight: 1.1 }}>
          {t('catalog.title')}
        </div>
        <div style={{ fontSize: '13px', color: colors.textMuted, marginTop: '4px', marginBottom: '20px' }}>
          {t('catalog.subtitle')}
        </div>
      </div>

      <CategoryTabs active={category} onChange={setCategory} />

      <div style={{ padding: '0 24px' }}>
        {isCourses ? (
          <>
            <SubsectionEyebrow>{t('subscriptions.section_title_courses')}</SubsectionEyebrow>
            {coursesList.map((s) => (
              <CourseCard key={s.id} service={s} />
            ))}

            <div style={{ height: 8 }} />
            <SubsectionEyebrow>{t('subscriptions.section_title_packages')}</SubsectionEyebrow>
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                onBuy={startSubscriptionPurchase}
              />
            ))}
          </>
        ) : (
          list.map((s) =>
            s.isSubscription ? (
              <CourseCard key={s.id} service={s} />
            ) : (
              <ServiceCard key={s.id} service={s} />
            ),
          )
        )}
      </div>
    </div>
  );
}
