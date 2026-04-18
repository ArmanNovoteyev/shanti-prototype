import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation.js';
import { reviews } from '../data/reviews.js';
import { branches, getBranch } from '../data/branches.js';
import { masters, getMaster } from '../data/masters.js';

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

const display = {
  fontFamily: "'Fraunces', serif",
  fontWeight: 500,
  letterSpacing: '-0.02em',
};

const body = { fontFamily: "'Manrope', sans-serif" };

const CHEVRON_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%238A8B86' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>\")";

function Stars({ rating }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, flexShrink: 0 }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= rating;
        return (
          <Star
            key={i}
            size={14}
            color={filled ? tokens.copper : tokens.muted}
            fill={filled ? tokens.copper : 'none'}
            strokeWidth={filled ? 0 : 1.4}
          />
        );
      })}
    </span>
  );
}

function ReviewCard({ review, localized }) {
  const branch = getBranch(review.branch);
  const master = getMaster(review.masterId);
  return (
    <article
      style={{
        background: tokens.ivory,
        border: '1px solid rgba(42,46,40,0.06)',
        borderRadius: 20,
        padding: 16,
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ ...body, fontSize: 14, fontWeight: 600, color: tokens.text }}>
          {review.author}
        </span>
        <Stars rating={review.rating} />
      </header>
      <p
        style={{
          ...body,
          fontSize: 14,
          color: tokens.text,
          lineHeight: 1.55,
          margin: '10px 0 10px',
        }}
      >
        {review.text_ru}
      </p>
      <footer
        style={{
          ...body,
          fontSize: 12,
          color: tokens.muted,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px 8px',
        }}
      >
        <span>{review.service}</span>
        <span>·</span>
        <span>{localized(branch, 'name')}</span>
        {master && (
          <>
            <span>·</span>
            <span>{localized(master, 'name')}</span>
          </>
        )}
        <span>·</span>
        <span>{review.date}</span>
      </footer>
    </article>
  );
}

export default function ReviewsScreen() {
  const { t, localized } = useTranslation();
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterMaster, setFilterMaster] = useState('all');

  const filtered = useMemo(
    () =>
      reviews.filter(
        (r) =>
          (filterBranch === 'all' || r.branch === filterBranch) &&
          (filterMaster === 'all' || r.masterId === filterMaster),
      ),
    [filterBranch, filterMaster],
  );

  const selectStyle = {
    ...body,
    flex: 1,
    minWidth: 0,
    background: tokens.ivory,
    border: '1px solid rgba(42,46,40,0.1)',
    borderRadius: 14,
    padding: '12px 36px 12px 14px',
    fontSize: 14,
    color: tokens.text,
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    cursor: 'pointer',
    backgroundImage: CHEVRON_SVG,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  return (
    <div style={{ padding: '20px 16px 32px', background: tokens.ivory, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            ...display,
            fontSize: 28,
            color: tokens.deepSage,
            margin: '4px 4px 4px',
          }}
        >
          {t('home.reviews_title')}
        </div>
        <div style={{ ...body, fontSize: 13, color: tokens.muted, margin: '0 4px' }}>
          {t('reviews.subtitle')}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <select
          style={selectStyle}
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          aria-label={t('reviews.filter_branch')}
        >
          <option value="all">{t('reviews.branch_all')}</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {localized(b, 'name')}
            </option>
          ))}
        </select>
        <select
          style={selectStyle}
          value={filterMaster}
          onChange={(e) => setFilterMaster(e.target.value)}
          aria-label={t('reviews.filter_master')}
        >
          <option value="all">{t('reviews.master_all')}</option>
          {masters.map((m) => (
            <option key={m.id} value={m.id}>
              {localized(m, 'name')}
            </option>
          ))}
        </select>
      </div>

      {/* List or empty */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: tokens.ivory,
            border: '1px solid rgba(42,46,40,0.06)',
            borderRadius: 20,
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div style={{ ...body, fontSize: 14, color: tokens.muted, marginBottom: 14 }}>
            {t('reviews.empty')}
          </div>
          <button
            type="button"
            onClick={() => {
              setFilterBranch('all');
              setFilterMaster('all');
            }}
            style={{
              ...body,
              background: tokens.copper,
              color: tokens.ivory,
              border: 'none',
              borderRadius: 14,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('reviews.reset_filters')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((r) => (
            <ReviewCard key={r.id} review={r} localized={localized} />
          ))}
        </div>
      )}
    </div>
  );
}
