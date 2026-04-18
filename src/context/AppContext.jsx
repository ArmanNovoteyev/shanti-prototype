import { createContext, useState, useMemo, useCallback, useRef } from 'react';

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

const EMPTY_DRAFT = {
  serviceId: null,
  branchId: null,
  durationMinutes: null,
  masterId: null,
  date: null,
  time: null,
  visitType: null,
  partyPeople: null,
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

export function AppProvider({ children }) {
  const [lang, setLang] = useState('ru');
  const [user] = useState(DEFAULT_USER);
  const [screen, setScreen] = useState('home');
  const [bookings, setBookings] = useState([DEFAULT_BOOKING]);
  const [bonus, setBonus] = useState({ balance: 4200, visitsToFifth: 3 });
  const [backBalance, setBackBalance] = useState(DEFAULT_BACK_BALANCE);
  const [bookingDraft, setBookingDraft] = useState(EMPTY_DRAFT);
  const [giftDraft, setGiftDraft] = useState(EMPTY_GIFT_DRAFT);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

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

  const startBookingFor = useCallback((serviceId) => {
    setBookingDraft({ ...EMPTY_DRAFT, serviceId });
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
      bookingDraft,
      startBookingFor,
      resetBookingDraft,
      giftDraft,
      resetGiftDraft,
      bonus,
      backBalance,
      purchaseBackBalance,
      consumeBackBalanceVisit,
      toast,
      showToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
