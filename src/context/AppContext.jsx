import { createContext, useState, useMemo, useCallback, useRef } from 'react';
import { subscriptions as SUBSCRIPTION_TARIFFS } from '../data/subscriptions.js';

export const AppContext = createContext(null);

const DEFAULT_USER = {
  name: 'Айгерим',
  phone: '+7 777 123 45 67',
  birthday: 'август 14',
  favorite_branch: 'satpayeva',
  favorite_master: 'en',
};

const DEFAULT_BOOKING = {
  id: 'mock-1',
  serviceId: 'sila-buddy',
  serviceName: 'Сила Будды',
  durationMinutes: 90,
  price: 23000,
  masterId: 'en',
  masterName: 'Эн',
  branchId: 'satpayeva',
  branchName: 'Сатпаева 50/1',
  date: '2026-04-22',
  time: '18:30',
};

const DEFAULT_BACK_BALANCE = { purchased: true, done: 2, total: 5 };

const DEFAULT_HISTORY = [
  { id: 'h1',  serviceId: 'samsara',          date: '2026-04-12', time: '17:30', masterId: 'tik',   branchId: 'nurmagambetova', price: 60000, durationMinutes: 120 },
  { id: 'h2',  serviceId: 'garmoniya-dushi',  date: '2026-04-05', time: '11:00', masterId: 'en',    branchId: 'satpayeva',      price: 23000, durationMinutes: 90 },
  { id: 'h3',  serviceId: 'sila-buddy',       date: '2026-03-29', time: '18:30', masterId: 'priya', branchId: 'satpayeva',      price: 18000, durationMinutes: 60 },
  { id: 'h4',  serviceId: 'foot-relax',       date: '2026-03-22', time: '12:00', masterId: 'nong',  branchId: 'nurmagambetova', price: 14000, durationMinutes: 60 },
  { id: 'h5',  serviceId: 'garmoniya-dushi',  date: '2026-03-15', time: '19:00', masterId: 'en',    branchId: 'satpayeva',      price: 23000, durationMinutes: 90 },
  { id: 'h6',  serviceId: 'second-life',      date: '2026-03-08', time: '14:00', masterId: 'tik',   branchId: 'nurmagambetova', price: 37000, durationMinutes: 120 },
  { id: 'h7',  serviceId: 'gracia',           date: '2026-03-01', time: '11:30', masterId: 'priya', branchId: 'satpayeva',      price: 12000, durationMinutes: 60 },
  { id: 'h8',  serviceId: 'garmoniya-dushi',  date: '2026-02-22', time: '20:00', masterId: 'en',    branchId: 'satpayeva',      price: 18000, durationMinutes: 60 },
  { id: 'h9',  serviceId: 'sabai-sabai',      date: '2026-02-15', time: '13:00', masterId: 'pey',   branchId: 'nurmagambetova', price: 32000, durationMinutes: 120 },
  { id: 'h10', serviceId: 'foot-relax',       date: '2026-02-08', time: '19:30', masterId: 'nong',  branchId: 'nurmagambetova', price: 14000, durationMinutes: 60 },
  { id: 'h11', serviceId: 'garmoniya-dushi',  date: '2026-02-01', time: '12:00', masterId: 'en',    branchId: 'satpayeva',      price: 23000, durationMinutes: 90 },
  { id: 'h12', serviceId: 'sila-buddy',       date: '2026-01-25', time: '17:00', masterId: 'priya', branchId: 'satpayeva',      price: 18000, durationMinutes: 60 },
  { id: 'h13', serviceId: 'awakening',        date: '2026-01-18', time: '14:30', masterId: 'tik',   branchId: 'nurmagambetova', price: 25000, durationMinutes: 90 },
  { id: 'h14', serviceId: 'garmoniya-dushi',  date: '2026-01-11', time: '18:00', masterId: 'en',    branchId: 'satpayeva',      price: 23000, durationMinutes: 90 },
  { id: 'h15', serviceId: 'foot-relax',       date: '2026-01-04', time: '13:30', masterId: 'nong',  branchId: 'nurmagambetova', price: 14000, durationMinutes: 60 },
  { id: 'h16', serviceId: 'sila-buddy',       date: '2025-12-28', time: '16:00', masterId: 'priya', branchId: 'satpayeva',      price: 18000, durationMinutes: 60 },
  { id: 'h17', serviceId: 'garmoniya-dushi',  date: '2025-12-21', time: '19:00', masterId: 'en',    branchId: 'satpayeva',      price: 18000, durationMinutes: 60 },
  { id: 'h18', serviceId: 'second-life',      date: '2025-12-14', time: '15:00', masterId: 'pey',   branchId: 'nurmagambetova', price: 37000, durationMinutes: 120 },
  { id: 'h19', serviceId: 'gracia',           date: '2025-12-07', time: '12:30', masterId: 'priya', branchId: 'satpayeva',      price: 12000, durationMinutes: 60 },
  { id: 'h20', serviceId: 'garmoniya-dushi',  date: '2025-11-30', time: '18:30', masterId: 'en',    branchId: 'satpayeva',      price: 23000, durationMinutes: 90 },
  { id: 'h21', serviceId: 'sila-buddy',       date: '2025-11-16', time: '14:00', masterId: 'priya', branchId: 'satpayeva',      price: 18000, durationMinutes: 60 },
  { id: 'h22', serviceId: 'foot-relax',       date: '2025-11-02', time: '19:30', masterId: 'nong',  branchId: 'nurmagambetova', price: 14000, durationMinutes: 60 },
  { id: 'h23', serviceId: 'garmoniya-dushi',  date: '2025-10-15', time: '11:00', masterId: 'en',    branchId: 'satpayeva',      price: 18000, durationMinutes: 60 },
];

const EMPTY_DRAFT = {
  serviceId: null,
  branchId: null,
  durationMinutes: null,
  masterId: null,
  date: null,
  time: null,
  visitType: null,
  partyPeople: null,
  happyHours: false,
};

const EMPTY_GIFT_DRAFT = {
  amount: null,
  recipientPhone: '',
  recipientName: '',
  senderName: '',
  design: null,
  code: null,
  validUntil: null,
};

const DEFAULT_USER_SUBSCRIPTIONS = [
  {
    id: 'sub-1',
    subscriptionId: 'gold',
    code: 'SH-SUB-2026-K7PX',
    purchasedAt: '2026-02-15',
    validUntil: '2026-05-15',
    hoursTotal: 50,
    hoursUsed: 12,
    holders: [
      { name: 'Айгерим', phone: '+7 705 123 45 67' },
      { name: 'Алина', phone: '+7 777 889 90 01' },
    ],
  },
];

function generateSubCode() {
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SH-SUB-2026-${rand()}`;
}

function addMonthsIso(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d.toISOString().slice(0, 10);
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState('ru');
  const [user] = useState(DEFAULT_USER);
  const [screen, setScreen] = useState('home');
  const [bookings, setBookings] = useState([DEFAULT_BOOKING]);
  const [bookingHistory] = useState(DEFAULT_HISTORY);
  const [bonus, setBonus] = useState({ balance: 3450, visitsToFifth: 3 });
  const [backBalance, setBackBalance] = useState(DEFAULT_BACK_BALANCE);
  const [bookingDraft, setBookingDraft] = useState(EMPTY_DRAFT);
  const [giftDraft, setGiftDraft] = useState(EMPTY_GIFT_DRAFT);
  const [userSubscriptions, setUserSubscriptions] = useState(DEFAULT_USER_SUBSCRIPTIONS);
  const [catalogInitialCategory, setCatalogInitialCategory] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const completeOnboarding = useCallback(() => {
    setHasSeenOnboarding(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    setHasSeenOnboarding(false);
    setScreen('home');
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const navigate = useCallback((nextScreen, payload = null) => {
    if (payload && typeof payload === 'object') {
      setBookingDraft((prev) => ({ ...prev, ...payload }));
    }
    setScreen(nextScreen);
  }, []);

  const startBookingFor = useCallback((serviceId, extra = {}) => {
    setBookingDraft({ ...EMPTY_DRAFT, serviceId, ...extra });
    setScreen('booking');
  }, []);

  const resetBookingDraft = useCallback(() => {
    setBookingDraft(EMPTY_DRAFT);
  }, []);

  const resetGiftDraft = useCallback(() => {
    setGiftDraft(EMPTY_GIFT_DRAFT);
  }, []);

  const addBooking = useCallback((booking) => {
    setBookings((prev) => [...prev, { ...booking, id: `b-${Date.now()}` }]);
  }, []);

  const purchaseBackBalance = useCallback(() => {
    setBackBalance({ purchased: true, done: 0, total: 5 });
  }, []);

  const consumeBackBalanceVisit = useCallback(() => {
    setBackBalance((prev) =>
      prev.purchased && prev.done < prev.total
        ? { ...prev, done: prev.done + 1 }
        : prev,
    );
  }, []);

  const purchaseSubscription = useCallback((subId, holders) => {
    const tariff = SUBSCRIPTION_TARIFFS.find((s) => s.id === subId);
    if (!tariff) return null;
    const today = new Date();
    const newSub = {
      id: `sub-${Date.now()}`,
      subscriptionId: subId,
      code: generateSubCode(),
      purchasedAt: today.toISOString().slice(0, 10),
      validUntil: addMonthsIso(today, tariff.durationMonths),
      hoursTotal: tariff.hours,
      hoursUsed: 0,
      holders: Array.isArray(holders) ? holders : [],
    };
    setUserSubscriptions((prev) => [...prev, newSub]);
    return newSub;
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      user,
      screen,
      setScreen,
      navigate,
      bookings,
      addBooking,
      bookingHistory,
      bookingDraft,
      setBookingDraft,
      startBookingFor,
      resetBookingDraft,
      giftDraft,
      setGiftDraft,
      resetGiftDraft,
      bonus,
      setBonus,
      backBalance,
      purchaseBackBalance,
      consumeBackBalanceVisit,
      userSubscriptions,
      purchaseSubscription,
      catalogInitialCategory,
      setCatalogInitialCategory,
      hasSeenOnboarding,
      completeOnboarding,
      resetOnboarding,
      toast,
      showToast,
    }),
    [
      lang,
      user,
      screen,
      navigate,
      bookings,
      addBooking,
      bookingHistory,
      bookingDraft,
      startBookingFor,
      resetBookingDraft,
      giftDraft,
      resetGiftDraft,
      bonus,
      backBalance,
      purchaseBackBalance,
      consumeBackBalanceVisit,
      userSubscriptions,
      purchaseSubscription,
      catalogInitialCategory,
      hasSeenOnboarding,
      completeOnboarding,
      resetOnboarding,
      toast,
      showToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
