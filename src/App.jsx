import { useContext, useEffect } from 'react';
import { Home, Sparkles, Gift, Calendar, User } from 'lucide-react';
import { AppProvider, AppContext } from './context/AppContext.jsx';
import { useTranslation } from './hooks/useTranslation.js';

import HomeScreen from './screens/HomeScreen.jsx';
import CatalogScreen from './screens/CatalogScreen.jsx';
import BookingScreen from './screens/BookingScreen.jsx';
import GiftScreen from './screens/GiftScreen.jsx';
import BookingsListScreen from './screens/BookingsListScreen.jsx';
import FeedbackScreen from './screens/FeedbackScreen.jsx';
import BonusScreen from './screens/BonusScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import ReviewsScreen from './screens/ReviewsScreen.jsx';

const tokens = {
  deepSage: '#344237',
  sage: '#4A5D4F',
  copper: '#B8794A',
  ivory: '#FBF8F1',
  cream: '#F2EDE3',
  muted: '#8A8B86',
  text: '#2A2E28',
};

const screens = {
  home: HomeScreen,
  catalog: CatalogScreen,
  booking: BookingScreen,
  gift: GiftScreen,
  bookings: BookingsListScreen,
  feedback: FeedbackScreen,
  bonus: BonusScreen,
  profile: ProfileScreen,
  reviews: ReviewsScreen,
};

function Shell() {
  const { t } = useTranslation();
  const { screen, navigate, toast } = useContext(AppContext);

  const Active = screens[screen] || HomeScreen;

  const navItems = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'catalog', icon: Sparkles, label: t('nav.catalog') },
    { id: 'gift', icon: Gift, label: t('nav.gift'), center: true },
    { id: 'bookings', icon: Calendar, label: t('nav.bookings') },
    { id: 'profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <div
      className="shanti-wrapper"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F7F3EC 0%, #F2EDE3 100%)',
        fontFamily: "'Manrope', sans-serif",
        color: tokens.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 12px',
      }}
    >
      <div
        className="phone-frame"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: 'min(900px, calc(100vh - 40px))',
          background: tokens.ivory,
          borderRadius: '44px',
          overflow: 'hidden',
          boxShadow: '0 40px 80px -20px rgba(42,46,40,0.25), 0 0 0 1px rgba(42,46,40,0.06)',
          border: '10px solid #1a1d19',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '14px 28px 8px',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <span>9:41</span>
          <span>•••</span>
        </div>

        <div style={{ flex: 1, padding: '8px 0 110px', overflowY: 'auto' }}>
          <Active />
        </div>

        <BottomNav items={navItems} active={screen} onChange={(id) => navigate(id)} />

        {toast && (
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              background: tokens.deepSage,
              color: tokens.ivory,
              padding: '12px 20px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 500,
              boxShadow: '0 12px 28px -12px rgba(0,0,0,0.4)',
              zIndex: 100,
              maxWidth: '85%',
              textAlign: 'center',
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

function BottomNav({ items, active, onChange }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(251,248,241,0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(42,46,40,0.08)',
        padding: '12px 0 24px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        if (item.center) {
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                background: tokens.copper,
                color: tokens.ivory,
                border: '4px solid rgba(251,248,241,0.95)',
                width: '58px',
                height: '58px',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginTop: '-26px',
                boxShadow: '0 10px 24px -10px rgba(184,121,74,0.6)',
                fontFamily: "'Manrope', sans-serif",
              }}
              aria-label={item.label}
            >
              <Icon size={22} strokeWidth={2} />
            </button>
          );
        }
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? tokens.deepSage : tokens.muted,
              fontWeight: isActive ? 600 : 500,
              fontSize: '11px',
              fontFamily: "'Manrope', sans-serif",
              transition: 'color 0.2s',
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

const RESPONSIVE_CSS = `
  html, body, #root { margin: 0; padding: 0; min-height: 100%; }
  @media (max-width: 500px) {
    .shanti-wrapper { padding: 0 !important; }
    .phone-frame {
      max-width: 100% !important;
      height: 100vh !important;
      height: 100dvh !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
  }
`;

export default function App() {
  useEffect(() => {
    if (!document.querySelector('link[data-shanti-fonts]')) {
      const link = document.createElement('link');
      link.href =
        'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Manrope:wght@300;400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      link.dataset.shantiFonts = 'true';
      document.head.appendChild(link);
    }
    if (!document.querySelector('style[data-shanti-responsive]')) {
      const style = document.createElement('style');
      style.dataset.shantiResponsive = 'true';
      style.textContent = RESPONSIVE_CSS;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
