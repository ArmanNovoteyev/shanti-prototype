import { useContext } from 'react';
import {
  Clock,
  Award,
  Gift,
  Users,
  MessageCircle,
  Activity,
  Sparkles,
} from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { colors } from '../theme/colors.js';

const body = { fontFamily: "'Manrope', sans-serif" };

export default function StoryCircles() {
  const { t } = useTranslation();
  const { navigate, showToast } = useContext(AppContext);

  const soon = () => showToast(t('home.story_soon_toast'));

  const stories = [
    {
      id: 'happy_hours',
      icon: Clock,
      labelKey: 'home.story_happy_hours',
      action: () => navigate('catalog'),
    },
    {
      id: 'subs',
      icon: Award,
      labelKey: 'home.story_subs',
      action: () => navigate('catalog'),
    },
    {
      id: 'gift',
      icon: Gift,
      labelKey: 'home.story_gift',
      action: () => navigate('gift'),
    },
    {
      id: 'masters',
      icon: Users,
      labelKey: 'home.story_masters',
      action: soon,
    },
    {
      id: 'reviews',
      icon: MessageCircle,
      labelKey: 'home.story_reviews',
      action: () => navigate('reviews'),
    },
    {
      id: 'back_balance',
      icon: Activity,
      labelKey: 'home.story_back_balance',
      action: () => navigate('service', { serviceId: 'back-balance' }),
    },
    {
      id: 'news',
      icon: Sparkles,
      labelKey: 'home.story_news',
      action: soon,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        padding: '20px 16px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {stories.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            type="button"
            onClick={s.action}
            style={{
              ...body,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: 0,
              minWidth: 72,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                border: `2.5px solid ${colors.copper}`,
                background: colors.cream,
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
                boxShadow: '0 4px 12px -6px rgba(184,121,74,0.35)',
              }}
            >
              <Icon size={28} color={colors.copper} strokeWidth={1.8} />
            </div>
            <span
              style={{
                fontSize: 11,
                color: colors.textMain,
                textAlign: 'center',
                maxWidth: 72,
                lineHeight: 1.2,
                fontWeight: 500,
              }}
            >
              {t(s.labelKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
