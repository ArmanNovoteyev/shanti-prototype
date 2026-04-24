import { useState, useContext, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { colors } from '../theme/colors.js';
import { FONT_DISPLAY, FONT_BODY, FONT_FAMILY } from '../theme/fonts.js';
import {
  subscriptions,
  SUBSCRIPTION_METAL_COLORS,
  formatPrice,
} from '../data/subscriptions.js';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.02em' };
const body = { ...FONT_BODY };

function Eyebrow({ children, dark = false }) {
  return (
    <div
      style={{
        ...body,
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: dark ? 'rgba(251,248,241,0.8)' : colors.textMuted,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

function Slide1() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.cream,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '88px 32px 64px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 360, width: '100%' }}>
        <img
          src="/assets/logo/shanti-logo-on-light.png"
          alt="Shanti"
          style={{
            width: 108,
            height: 'auto',
            display: 'block',
            margin: '0 auto 28px',
          }}
        />
        <img
          src="/assets/photos/31-lotus-shanti-towel.jpg"
          alt=""
          style={{
            width: 240,
            height: 240,
            maxWidth: '70vw',
            maxHeight: '70vw',
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
            margin: '0 auto 36px',
            boxShadow: '0 24px 48px -22px rgba(42,32,25,0.35)',
          }}
        />
        <h1
          style={{
            ...display,
            fontSize: 52,
            color: colors.deepBrown,
            margin: 0,
            lineHeight: 1,
          }}
        >
          Любовь к&nbsp;себе
        </h1>
        <p
          style={{
            ...body,
            fontSize: 16,
            color: colors.textMuted,
            margin: '18px auto 0',
            lineHeight: 1.5,
            maxWidth: 320,
          }}
        >
          Ваш ритуал заботы — настоящий тайский SPA в Усть-Каменогорске
        </p>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundImage: 'url(/assets/photos/20-herbal-compress-lotus.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(42,32,25,0.25) 0%, rgba(42,32,25,0.55) 60%, rgba(42,32,25,0.85) 100%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px 32px 72px',
          boxSizing: 'border-box',
          color: colors.ivory,
          maxWidth: 440,
          margin: '0 auto',
        }}
      >
        <Eyebrow dark>Настоящий тайский</Eyebrow>
        <h1
          style={{
            ...display,
            fontSize: 44,
            color: colors.ivory,
            margin: '12px 0 0',
            lineHeight: 1.05,
          }}
        >
          31 процедура
        </h1>
        <p
          style={{
            ...body,
            fontSize: 16,
            color: colors.ivory,
            opacity: 0.9,
            margin: '20px 0 0',
            lineHeight: 1.5,
            maxWidth: 360,
          }}
        >
          Массажи, SPA-комплексы, парные программы и особые ритуалы
        </p>
        <div
          style={{
            marginTop: 28,
            alignSelf: 'flex-start',
            padding: '11px 18px',
            border: '1px solid rgba(251,248,241,0.55)',
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            ...body,
            fontSize: 13,
            fontWeight: 700,
            color: colors.ivory,
          }}
        >
          Смотреть каталог
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.ivory,
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 24px 56px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: '100%',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Eyebrow>Абонементы</Eyebrow>
        <h1
          style={{
            ...display,
            fontSize: 42,
            color: colors.copper,
            margin: '12px 0 0',
            lineHeight: 1.1,
          }}
        >
          От 11 000 ₸ за час
        </h1>
        <p
          style={{
            ...body,
            fontSize: 15,
            color: colors.textMuted,
            margin: '14px auto 0',
            lineHeight: 1.5,
            maxWidth: 320,
          }}
        >
          Купите часы пачкой и экономьте до 700 000 ₸ на PLATINUM
        </p>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 10,
          marginTop: 28,
          maxWidth: 400,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {subscriptions.map((s) => (
          <div
            key={s.id}
            style={{
              background: colors.cream,
              border: '1px solid rgba(42,32,25,0.06)',
              borderRadius: 16,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 10,
                height: 44,
                borderRadius: 5,
                background: SUBSCRIPTION_METAL_COLORS[s.color],
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  ...display,
                  fontSize: 18,
                  color: colors.deepBrown,
                  letterSpacing: '0.1em',
                }}
              >
                {s.name_ru}
              </div>
              <div
                style={{
                  ...body,
                  fontSize: 12,
                  color: colors.textMuted,
                  marginTop: 2,
                }}
              >
                {s.hours} часов · {s.durationMonths}{' '}
                {s.durationMonths === 1 ? 'месяц' : 'мес.'}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div
                style={{
                  ...display,
                  fontSize: 18,
                  color: colors.copper,
                  whiteSpace: 'nowrap',
                }}
              >
                {formatPrice(s.pricePerHour)}
              </div>
              <div
                style={{
                  ...body,
                  fontSize: 11,
                  color: colors.textMuted,
                  marginTop: 2,
                }}
              >
                за час
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide4() {
  const designs = [
    { id: 'newyear',  src: '/assets/certificates/cert-newyear.jpg',  bgPos: '100% center' },
    { id: '8march',   src: '/assets/certificates/cert-8march.jpg',   bgPos: '100% center' },
    { id: 'birthday', src: '/assets/certificates/cert-birthday.jpg', bgPos: '100% center' },
    { id: 'everyday', src: '/assets/certificates/cert-everyday.jpg', bgPos: '100% center' },
  ];
  const rotations = [-10, -4, 4, 10];
  const xOffsets  = [0, 54, 108, 162];
  const yOffsets  = [4, 0, 0, 4];
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.cream,
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 32px 56px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: 400,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Eyebrow>Сертификат</Eyebrow>
        <h1
          style={{
            ...display,
            fontSize: 44,
            color: colors.deepBrown,
            margin: '12px 0 0',
            lineHeight: 1.05,
            textAlign: 'center',
          }}
        >
          Удовольствие<br />в подарок
        </h1>
        <p
          style={{
            ...body,
            fontSize: 15,
            color: colors.textMuted,
            margin: '16px auto 0',
            lineHeight: 1.5,
            textAlign: 'center',
            maxWidth: 300,
          }}
        >
          4 дизайна, от 20 000 ₸, мгновенно в WhatsApp
        </p>
        <div
          style={{
            position: 'relative',
            width: 318,
            height: 120,
            marginTop: 44,
          }}
        >
          {designs.map((d, i) => (
            <div
              key={d.id}
              style={{
                position: 'absolute',
                left: xOffsets[i],
                top: yOffsets[i],
                width: 140,
                height: 94,
                borderRadius: 12,
                backgroundImage: `url(${d.src})`,
                backgroundSize: '280px 188px',
                backgroundPosition: d.bgPos,
                transform: `rotate(${rotations[i]}deg)`,
                transformOrigin: 'center center',
                boxShadow: '0 14px 28px -14px rgba(42,32,25,0.4)',
                zIndex: designs.length - i,
              }}
              aria-label={`Сертификат ${d.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide5() {
  const pips = [true, true, false, false, false];
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.ivory,
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 28px 56px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: '100%',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Eyebrow>Лояльность</Eyebrow>
        <h1
          style={{
            ...display,
            fontSize: 40,
            color: colors.deepBrown,
            margin: '12px 0 0',
            lineHeight: 1.1,
          }}
        >
          Возвращайтесь<br />с наградой
        </h1>
        <p
          style={{
            ...body,
            fontSize: 15,
            color: colors.textMuted,
            margin: '14px auto 0',
            lineHeight: 1.5,
            maxWidth: 320,
          }}
        >
          1 балл за каждые 10 ₸. И курс Back Balance с трекером.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 14,
          marginTop: 24,
          maxWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
        }}
      >
        {/* Bonus card */}
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.copper} 0%, ${colors.copperDark} 100%)`,
            color: colors.ivory,
            borderRadius: 22,
            padding: '22px 24px',
            boxShadow: '0 20px 40px -20px rgba(184,121,74,0.55)',
          }}
        >
          <div
            style={{
              ...body,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.85,
              fontWeight: 700,
            }}
          >
            Ваш баланс
          </div>
          <div style={{ ...display, fontSize: 44, marginTop: 6, lineHeight: 1 }}>
            3 450{' '}
            <span style={{ fontSize: 18, opacity: 0.9 }}>баллов</span>
          </div>
          <div style={{ ...body, fontSize: 12, marginTop: 8, opacity: 0.85 }}>
            ≈ 34 500 ₸ на следующий визит
          </div>
        </div>

        {/* Back Balance tracker */}
        <div
          style={{
            background: colors.cream,
            border: '1px solid rgba(42,32,25,0.06)',
            borderRadius: 20,
            padding: '18px 22px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <div style={{ ...display, fontSize: 17, color: colors.deepBrown }}>
              Back Balance
            </div>
            <div style={{ ...body, fontSize: 12, color: colors.textMuted }}>
              2 из 5
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {pips.map((done, i) => (
              <div
                key={i}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: done ? colors.copper : 'transparent',
                  border: `2px solid ${done ? colors.copper : 'rgba(184,121,74,0.35)'}`,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide6({ onStart }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundImage: 'url(/assets/photos/26-tea-ceremony.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(42,32,25,0.35) 0%, rgba(42,32,25,0.65) 60%, rgba(42,32,25,0.82) 100%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px 32px 88px',
          boxSizing: 'border-box',
          color: colors.ivory,
          maxWidth: 440,
          margin: '0 auto',
        }}
      >
        <Eyebrow dark>Начнём?</Eyebrow>
        <h1
          style={{
            ...display,
            fontSize: 36,
            color: colors.ivory,
            margin: '12px 0 0',
            lineHeight: 1.1,
          }}
        >
          Готовы к первому визиту?
        </h1>
        <p
          style={{
            ...body,
            fontSize: 15,
            color: colors.ivory,
            opacity: 0.9,
            margin: '18px 0 0',
            lineHeight: 1.5,
            maxWidth: 380,
          }}
        >
          Запишитесь онлайн за 30 секунд. Два филиала, 5 мастеров, 389 отзывов · 4.8 ★
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          style={{
            marginTop: 32,
            height: 56,
            background: colors.copper,
            color: colors.ivory,
            border: 'none',
            borderRadius: 16,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            ...body,
            boxShadow: '0 18px 36px -16px rgba(184,121,74,0.8)',
          }}
        >
          Начать
        </button>
      </div>
    </div>
  );
}

export default function OnboardingScreen() {
  const [slideIdx, setSlideIdx] = useState(0);
  const { completeOnboarding } = useContext(AppContext);

  const totalSlides = 6;
  const isDark = slideIdx === 1 || slideIdx === 5;

  const handleNext = () => {
    if (slideIdx < totalSlides - 1) {
      setSlideIdx(slideIdx + 1);
    } else {
      completeOnboarding();
    }
  };
  const handleBack = () => {
    if (slideIdx > 0) setSlideIdx(slideIdx - 1);
  };
  const handleSkip = () => {
    completeOnboarding();
  };

  useEffect(() => {
    if (slideIdx >= totalSlides - 1) return;
    const t = setTimeout(() => {
      setSlideIdx((idx) => (idx < totalSlides - 1 ? idx + 1 : idx));
    }, 5000);
    return () => clearTimeout(t);
  }, [slideIdx]);

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) handleNext();
    else handleBack();
  };

  const slides = [
    <Slide1 key="1" />,
    <Slide2 key="2" />,
    <Slide3 key="3" />,
    <Slide4 key="4" />,
    <Slide5 key="5" />,
    <Slide6 key="6" onStart={handleNext} />,
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: colors.ivory,
        fontFamily: FONT_FAMILY,
        color: colors.textMain,
        overflow: 'hidden',
      }}
    >
      {/* Tap zone fills viewport — placed first so overlay controls sit above */}
      <div
        onClick={handleTap}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'pointer',
        }}
      >
        {slides[slideIdx]}
      </div>

      {/* Progress bar */}
      <style>{`@keyframes shanti-onboarding-fill { from { width: 0%; } to { width: 100%; } }`}</style>
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          display: 'flex',
          gap: 4,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: totalSlides }).map((_, i) => {
          const trackBg = isDark ? 'rgba(251,248,241,0.3)' : 'rgba(42,32,25,0.18)';
          const fillBg = isDark ? 'rgba(251,248,241,0.95)' : colors.deepBrown;
          const isPast = i < slideIdx;
          const isActive = i === slideIdx;
          const isLast = slideIdx === totalSlides - 1;
          let fillWidth = '0%';
          let animation;
          if (isPast) fillWidth = '100%';
          else if (isActive && isLast) fillWidth = '100%';
          else if (isActive) {
            fillWidth = '0%';
            animation = 'shanti-onboarding-fill 5s linear forwards';
          }
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 1.5,
                background: trackBg,
                overflow: 'hidden',
              }}
            >
              <div
                key={isActive ? `active-${slideIdx}` : `static-${i}`}
                style={{
                  width: fillWidth,
                  height: '100%',
                  background: fillBg,
                  animation,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Skip button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        aria-label="Пропустить"
        style={{
          position: 'absolute',
          top: 26,
          right: 16,
          zIndex: 20,
          width: 36,
          height: 36,
          borderRadius: 18,
          border: 'none',
          background: isDark ? 'rgba(42,32,25,0.4)' : 'rgba(42,32,25,0.08)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
      >
        <X size={18} color={isDark ? colors.ivory : colors.deepBrown} />
      </button>
    </div>
  );
}
