import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star, Gift, User, ChevronRight, ChevronLeft, Heart, Check, Home, Sparkles, Award, Bell } from 'lucide-react';

export default function ShantiSpaApp() {
  const [screen, setScreen] = useState('home');
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Массаж');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Manrope:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const services = {
    'Массаж': [
      { name: 'Тайский традиционный', duration: 90, price: 22000, desc: 'Классика в шёлковом кимоно' },
      { name: 'Оздоровительный', duration: 60, price: 18000, desc: 'Глубокая проработка мышц' },
      { name: 'Релаксирующий', duration: 60, price: 17000, desc: 'Аромамасла, полное расслабление' },
      { name: 'Антицеллюлитный', duration: 60, price: 20000, desc: 'Интенсивная работа с проблемными зонами' },
      { name: 'Массаж в 4 руки', duration: 60, price: 32000, desc: 'Два мастера одновременно' },
      { name: 'Лимфодренаж', duration: 60, price: 19000, desc: 'Снятие отёков, детокс' },
    ],
    'Косметология': [
      { name: 'Чистка лица', duration: 60, price: 15000, desc: 'Глубокая ультразвуковая чистка' },
      { name: 'Аппаратная косметология', duration: 45, price: 18000, desc: 'Лифтинг, омоложение' },
      { name: 'Восковая эпиляция', duration: 30, price: 8000, desc: 'Мягкий тёплый воск' },
    ],
    'SPA-программы': [
      { name: 'Для двоих', duration: 120, price: 58000, desc: 'Романтический ритуал на двоих' },
      { name: 'Для женщин', duration: 150, price: 38000, desc: 'Массаж + скраб + обёртывание' },
      { name: 'Для мужчин', duration: 120, price: 32000, desc: 'Спортивный уход + стоун-терапия' },
    ],
  };

  const branches = [
    { id: 1, name: 'Сатпаева', address: 'пр. К. Сатпаева, 50/1', hours: '10:00–23:00' },
    { id: 2, name: 'Нурмагамбетов', address: 'ул. С. Нурмагамбетова, 4', hours: '10:00–23:00' },
  ];

  const masters = [
    { id: 1, name: 'นัท (Нат)', rating: 4.9, reviews: 127, specialty: 'Тайский, оздоровительный' },
    { id: 2, name: 'ฝน (Фон)', rating: 5.0, reviews: 89, specialty: 'SPA-программы' },
    { id: 3, name: 'มาลี (Мали)', rating: 4.8, reviews: 156, specialty: 'Лимфодренаж, релакс' },
    { id: 4, name: 'Любой мастер', rating: null, specialty: 'Первый свободный' },
  ];

  const timeSlots = ['11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '21:30'];

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F7F3EC 0%, #F2EDE3 100%)',
      fontFamily: "'Manrope', sans-serif",
      color: '#2A2E28',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 12px',
    },
    phoneFrame: {
      width: '100%',
      maxWidth: '420px',
      background: '#FBF8F1',
      borderRadius: '44px',
      overflow: 'hidden',
      boxShadow: '0 40px 80px -20px rgba(42, 46, 40, 0.25), 0 0 0 1px rgba(42, 46, 40, 0.06)',
      border: '10px solid #1a1d19',
      position: 'relative',
      minHeight: '820px',
      display: 'flex',
      flexDirection: 'column',
    },
    statusBar: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '14px 28px 8px',
      fontSize: '13px',
      fontWeight: 600,
      color: '#2A2E28',
    },
    content: {
      flex: 1,
      padding: '8px 24px 100px',
      overflowY: 'auto',
    },
    display: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 500,
      letterSpacing: '-0.02em',
    },
    sage: '#4A5D4F',
    deepSage: '#344237',
    copper: '#B8794A',
    ivory: '#FBF8F1',
    cream: '#F2EDE3',
    muted: '#8A8B86',
  };

  const bottomNav = (
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      background: 'rgba(251, 248, 241, 0.92)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(42,46,40,0.08)',
      padding: '12px 0 24px',
      display: 'flex',
      justifyContent: 'space-around',
    }}>
      {[
        { id: 'home', icon: Home, label: 'Главная' },
        { id: 'catalog', icon: Sparkles, label: 'Услуги' },
        { id: 'bookings', icon: Calendar, label: 'Записи' },
        { id: 'bonus', icon: Award, label: 'Бонусы' },
        { id: 'profile', icon: User, label: 'Профиль' },
      ].map(tab => {
        const Icon = tab.icon;
        const active = screen === tab.id || (tab.id === 'catalog' && screen === 'booking') || (tab.id === 'bookings' && screen === 'feedback');
        return (
          <button key={tab.id}
            onClick={() => { setScreen(tab.id); setBookingStep(1); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              color: active ? styles.deepSage : styles.muted,
              fontWeight: active ? 600 : 500,
              fontSize: '11px',
              fontFamily: "'Manrope', sans-serif",
              transition: 'all 0.2s',
            }}>
            <Icon size={20} strokeWidth={active ? 2.2 : 1.6} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  // === HOME ===
  const renderHome = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <div style={{ fontSize: '13px', color: styles.muted, letterSpacing: '0.02em', marginBottom: '4px' }}>สวัสดี, Айгерим</div>
          <div style={{ ...styles.display, fontSize: '30px', lineHeight: 1.1, color: styles.deepSage }}>
            Доброе<br/><em style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 400 }}>утро</em>
          </div>
        </div>
        <button style={{
          width: '42px', height: '42px', borderRadius: '50%',
          background: styles.ivory, border: '1px solid rgba(42,46,40,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Bell size={18} color={styles.deepSage} />
        </button>
      </div>

      {/* Ближайшая запись */}
      <div style={{
        background: styles.deepSage,
        borderRadius: '28px',
        padding: '24px',
        color: styles.ivory,
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 140, height: 140,
          borderRadius: '50%', background: 'rgba(184,121,74,0.15)',
        }} />
        <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.7, marginBottom: '10px' }}>
          Ближайший визит
        </div>
        <div style={{ ...styles.display, fontSize: '26px', marginBottom: '4px' }}>Тайский массаж</div>
        <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '18px' }}>мастер Нат · 90 минут</div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> 22 апр, сб
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} /> 18:30
          </span>
        </div>
        <div style={{
          marginTop: '18px', paddingTop: '18px',
          borderTop: '1px solid rgba(251,248,241,0.15)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>Сатпаева, 50/1</span>
          <button style={{
            background: styles.copper, color: styles.ivory, border: 'none',
            padding: '8px 16px', borderRadius: '20px', fontSize: '12px',
            fontWeight: 600, cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
          }}>Детали</button>
        </div>
      </div>

      {/* Быстрая запись */}
      <button onClick={() => { setScreen('booking'); setBookingStep(1); }}
        style={{
          width: '100%', background: styles.copper, color: styles.ivory,
          border: 'none', padding: '18px', borderRadius: '20px',
          fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginBottom: '28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          fontFamily: "'Manrope', sans-serif",
          boxShadow: '0 8px 24px -8px rgba(184,121,74,0.5)',
        }}>
        <Calendar size={18} /> Записаться
      </button>

      {/* Акция */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ ...styles.display, fontSize: '20px', color: styles.deepSage }}>Специально для вас</div>
        <span style={{ fontSize: '12px', color: styles.muted }}>смотреть все</span>
      </div>
      <div style={{
        background: 'linear-gradient(135deg, #E8DDC8 0%, #D4C4A8 100%)',
        borderRadius: '24px', padding: '22px',
        marginBottom: '16px',
      }}>
        <div style={{ fontSize: '11px', color: styles.copper, fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>
          ДЕНЬ РОЖДЕНИЯ
        </div>
        <div style={{ ...styles.display, fontSize: '22px', color: styles.deepSage, marginBottom: '8px', lineHeight: 1.2 }}>
          −30% на любую<br/>программу в ваш месяц
        </div>
        <div style={{ fontSize: '13px', color: styles.deepSage, opacity: 0.75 }}>
          Ваш месяц — август. Ждём вас.
        </div>
      </div>

      <div style={{
        background: styles.ivory, borderRadius: '24px', padding: '22px',
        border: '1px solid rgba(42,46,40,0.06)',
      }}>
        <div style={{ fontSize: '11px', color: styles.sage, fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>
          НОВИНКА
        </div>
        <div style={{ ...styles.display, fontSize: '20px', color: styles.deepSage, marginBottom: '6px', lineHeight: 1.2 }}>
          Стоун-терапия<br/>вулканическими камнями
        </div>
        <div style={{ fontSize: '13px', color: styles.muted }}>
          Приехал новый мастер из Чианг-Мая
        </div>
      </div>
    </div>
  );

  // === CATALOG ===
  const renderCatalog = () => (
    <div>
      <div style={{ ...styles.display, fontSize: '32px', color: styles.deepSage, marginBottom: '6px', lineHeight: 1.1 }}>
        Услуги
      </div>
      <div style={{ fontSize: '13px', color: styles.muted, marginBottom: '24px' }}>
        Выбирайте ритуал по настроению
      </div>

      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px',
        overflowX: 'auto', paddingBottom: '4px',
      }}>
        {Object.keys(services).map(cat => (
          <button key={cat} onClick={() => setServiceCategory(cat)}
            style={{
              padding: '10px 18px', borderRadius: '20px',
              background: serviceCategory === cat ? styles.deepSage : 'transparent',
              color: serviceCategory === cat ? styles.ivory : styles.deepSage,
              border: serviceCategory === cat ? 'none' : '1px solid rgba(42,46,40,0.15)',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              whiteSpace: 'nowrap', fontFamily: "'Manrope', sans-serif",
              transition: 'all 0.2s',
            }}>{cat}</button>
        ))}
      </div>

      {services[serviceCategory].map((s, i) => (
        <div key={i} style={{
          background: styles.ivory, borderRadius: '20px', padding: '20px',
          marginBottom: '12px', border: '1px solid rgba(42,46,40,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <div style={{ ...styles.display, fontSize: '18px', color: styles.deepSage, flex: 1, paddingRight: '12px' }}>
              {s.name}
            </div>
            <div style={{ ...styles.display, fontSize: '17px', color: styles.copper, whiteSpace: 'nowrap' }}>
              {s.price.toLocaleString()} ₸
            </div>
          </div>
          <div style={{ fontSize: '13px', color: styles.muted, marginBottom: '14px' }}>
            {s.desc}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: styles.sage, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={12} /> {s.duration} мин
            </span>
            <button onClick={() => { setSelectedService(s); setScreen('booking'); setBookingStep(1); }}
              style={{
                background: 'transparent', color: styles.deepSage,
                border: `1px solid ${styles.deepSage}`, padding: '7px 14px',
                borderRadius: '16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: "'Manrope', sans-serif",
              }}>
              Записаться <ChevronRight size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // === BOOKING ===
  const renderBooking = () => {
    const canNext = () => {
      if (bookingStep === 1) return selectedBranch;
      if (bookingStep === 2) return selectedService;
      if (bookingStep === 3) return selectedMaster;
      if (bookingStep === 4) return selectedDate && selectedTime;
      return true;
    };

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => bookingStep > 1 ? setBookingStep(bookingStep - 1) : setScreen('home')}
            style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: styles.ivory, border: '1px solid rgba(42,46,40,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
            <ChevronLeft size={18} color={styles.deepSage} />
          </button>
          <div style={{ fontSize: '12px', color: styles.muted, letterSpacing: '0.1em' }}>
            ШАГ {bookingStep} / 5
          </div>
        </div>

        {/* Прогресс */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px' }}>
          {[1,2,3,4,5].map(s => (
            <div key={s} style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: s <= bookingStep ? styles.deepSage : 'rgba(42,46,40,0.12)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {bookingStep === 1 && (
          <div>
            <div style={{ ...styles.display, fontSize: '26px', color: styles.deepSage, marginBottom: '6px', lineHeight: 1.2 }}>
              Какой филиал<br/>вам ближе?
            </div>
            <div style={{ fontSize: '13px', color: styles.muted, marginBottom: '24px' }}>
              Оба работают с 10:00 до 23:00
            </div>
            {branches.map(b => (
              <button key={b.id} onClick={() => setSelectedBranch(b)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: selectedBranch?.id === b.id ? styles.deepSage : styles.ivory,
                  color: selectedBranch?.id === b.id ? styles.ivory : styles.deepSage,
                  border: '1px solid rgba(42,46,40,0.08)',
                  borderRadius: '20px', padding: '20px', marginBottom: '12px',
                  cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
                  transition: 'all 0.2s',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ ...styles.display, fontSize: '20px', marginBottom: '4px' }}>{b.name}</div>
                    <div style={{ fontSize: '13px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {b.address}
                    </div>
                  </div>
                  {selectedBranch?.id === b.id && (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: styles.copper, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={16} color={styles.ivory} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {bookingStep === 2 && (
          <div>
            <div style={{ ...styles.display, fontSize: '26px', color: styles.deepSage, marginBottom: '20px', lineHeight: 1.2 }}>
              Выберите<br/>услугу
            </div>
            <div style={{
              display: 'flex', gap: '8px', marginBottom: '16px',
              overflowX: 'auto', paddingBottom: '4px',
            }}>
              {Object.keys(services).map(cat => (
                <button key={cat} onClick={() => setServiceCategory(cat)}
                  style={{
                    padding: '8px 14px', borderRadius: '16px',
                    background: serviceCategory === cat ? styles.deepSage : 'transparent',
                    color: serviceCategory === cat ? styles.ivory : styles.deepSage,
                    border: serviceCategory === cat ? 'none' : '1px solid rgba(42,46,40,0.15)',
                    fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                    whiteSpace: 'nowrap', fontFamily: "'Manrope', sans-serif",
                  }}>{cat}</button>
              ))}
            </div>
            {services[serviceCategory].map((s, i) => (
              <button key={i} onClick={() => setSelectedService(s)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: selectedService?.name === s.name ? styles.deepSage : styles.ivory,
                  color: selectedService?.name === s.name ? styles.ivory : styles.deepSage,
                  border: '1px solid rgba(42,46,40,0.05)',
                  borderRadius: '16px', padding: '16px', marginBottom: '8px',
                  cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ ...styles.display, fontSize: '16px', marginBottom: '2px' }}>{s.name}</div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>{s.duration} мин</div>
                  </div>
                  <div style={{ ...styles.display, fontSize: '15px', color: selectedService?.name === s.name ? styles.copper : styles.copper }}>
                    {s.price.toLocaleString()} ₸
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {bookingStep === 3 && (
          <div>
            <div style={{ ...styles.display, fontSize: '26px', color: styles.deepSage, marginBottom: '6px', lineHeight: 1.2 }}>
              Ваш мастер
            </div>
            <div style={{ fontSize: '13px', color: styles.muted, marginBottom: '24px' }}>
              Все мастера — из Таиланда, с сертификатами
            </div>
            {masters.map(m => (
              <button key={m.id} onClick={() => setSelectedMaster(m)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: selectedMaster?.id === m.id ? styles.deepSage : styles.ivory,
                  color: selectedMaster?.id === m.id ? styles.ivory : styles.deepSage,
                  border: '1px solid rgba(42,46,40,0.05)',
                  borderRadius: '20px', padding: '16px', marginBottom: '10px',
                  cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
                  display: 'flex', gap: '14px', alignItems: 'center',
                }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: m.id === 4 ? 'rgba(184,121,74,0.2)' : 'linear-gradient(135deg, #E8DDC8, #B8794A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Fraunces', serif", fontSize: '20px',
                  color: selectedMaster?.id === m.id ? styles.ivory : styles.deepSage,
                  flexShrink: 0,
                }}>
                  {m.id === 4 ? '?' : m.name.split(' ')[1]?.[1] || '—'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...styles.display, fontSize: '17px', marginBottom: '2px' }}>{m.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>{m.specialty}</div>
                </div>
                {m.rating && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                      <Star size={12} fill={styles.copper} color={styles.copper} />
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{m.rating}</span>
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>{m.reviews} отзывов</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {bookingStep === 4 && (
          <div>
            <div style={{ ...styles.display, fontSize: '26px', color: styles.deepSage, marginBottom: '20px', lineHeight: 1.2 }}>
              Дата и время
            </div>
            <div style={{ fontSize: '12px', color: styles.muted, letterSpacing: '0.1em', marginBottom: '10px' }}>АПРЕЛЬ 2026</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px',
              marginBottom: '24px',
            }}>
              {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => (
                <div key={d} style={{ fontSize: '10px', color: styles.muted, textAlign: 'center', paddingBottom: '4px' }}>{d}</div>
              ))}
              {[20,21,22,23,24,25,26].map(d => {
                const isSelected = selectedDate === d;
                const isPast = d < 20;
                return (
                  <button key={d} onClick={() => !isPast && setSelectedDate(d)}
                    disabled={isPast}
                    style={{
                      aspectRatio: '1', borderRadius: '12px',
                      background: isSelected ? styles.deepSage : styles.ivory,
                      color: isSelected ? styles.ivory : isPast ? styles.muted : styles.deepSage,
                      border: '1px solid rgba(42,46,40,0.05)',
                      fontSize: '14px', fontWeight: 500, cursor: isPast ? 'not-allowed' : 'pointer',
                      fontFamily: "'Manrope', sans-serif",
                      opacity: isPast ? 0.3 : 1,
                    }}>{d}</button>
                );
              })}
            </div>

            <div style={{ fontSize: '12px', color: styles.muted, letterSpacing: '0.1em', marginBottom: '10px' }}>СВОБОДНОЕ ВРЕМЯ</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {timeSlots.map(t => (
                <button key={t} onClick={() => setSelectedTime(t)}
                  style={{
                    padding: '12px 0', borderRadius: '14px',
                    background: selectedTime === t ? styles.deepSage : styles.ivory,
                    color: selectedTime === t ? styles.ivory : styles.deepSage,
                    border: '1px solid rgba(42,46,40,0.05)',
                    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    fontFamily: "'Manrope', sans-serif",
                  }}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {bookingStep === 5 && (
          <div>
            <div style={{ ...styles.display, fontSize: '26px', color: styles.deepSage, marginBottom: '6px', lineHeight: 1.2 }}>
              Всё верно?
            </div>
            <div style={{ fontSize: '13px', color: styles.muted, marginBottom: '24px' }}>
              Проверьте детали записи
            </div>

            <div style={{
              background: styles.deepSage, color: styles.ivory,
              borderRadius: '24px', padding: '24px', marginBottom: '16px',
            }}>
              <div style={{ ...styles.display, fontSize: '22px', marginBottom: '4px' }}>
                {selectedService?.name || 'Тайский традиционный'}
              </div>
              <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '20px' }}>
                {selectedService?.duration || 90} минут
              </div>

              {[
                ['Филиал', selectedBranch?.name || 'Сатпаева'],
                ['Мастер', selectedMaster?.name || 'Нат'],
                ['Дата', `${selectedDate || 22} апреля, 2026`],
                ['Время', selectedTime || '18:30'],
              ].map(([k,v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0', borderTop: '1px solid rgba(251,248,241,0.1)',
                  fontSize: '13px',
                }}>
                  <span style={{ opacity: 0.7 }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '16px 0 0', borderTop: '1px solid rgba(251,248,241,0.1)',
                marginTop: '6px',
              }}>
                <span style={{ fontSize: '13px', opacity: 0.7 }}>Итого</span>
                <span style={{ ...styles.display, fontSize: '24px', color: styles.copper }}>
                  {(selectedService?.price || 22000).toLocaleString()} ₸
                </span>
              </div>
            </div>

            <div style={{
              background: 'rgba(74,93,79,0.08)', borderRadius: '14px',
              padding: '12px 14px', fontSize: '12px', color: styles.sage,
              marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start',
            }}>
              <Bell size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Напомним за 24 часа и за 2 часа до визита</span>
            </div>
          </div>
        )}

        <button onClick={() => {
          if (bookingStep < 5) { setBookingStep(bookingStep + 1); }
          else {
            setShowToast(true);
            setTimeout(() => { setShowToast(false); setScreen('home'); setBookingStep(1); }, 1800);
          }
        }}
          disabled={!canNext()}
          style={{
            width: '100%', background: canNext() ? styles.copper : 'rgba(42,46,40,0.15)',
            color: styles.ivory, border: 'none', padding: '16px',
            borderRadius: '20px', fontSize: '15px', fontWeight: 600,
            cursor: canNext() ? 'pointer' : 'not-allowed', marginTop: '20px',
            fontFamily: "'Manrope', sans-serif",
            boxShadow: canNext() ? '0 8px 24px -8px rgba(184,121,74,0.5)' : 'none',
            transition: 'all 0.2s',
          }}>
          {bookingStep < 5 ? 'Продолжить' : 'Подтвердить запись'}
        </button>
      </div>
    );
  };

  // === BOOKINGS LIST ===
  const renderBookings = () => (
    <div>
      <div style={{ ...styles.display, fontSize: '32px', color: styles.deepSage, marginBottom: '24px' }}>
        Записи
      </div>

      <div style={{ fontSize: '11px', color: styles.muted, letterSpacing: '0.1em', marginBottom: '10px' }}>ПРЕДСТОЯЩИЕ</div>
      <div style={{
        background: styles.deepSage, color: styles.ivory,
        borderRadius: '20px', padding: '20px', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ ...styles.display, fontSize: '18px', marginBottom: '2px' }}>Тайский массаж</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>мастер Нат</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>22 апр</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>18:30</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            flex: 1, background: 'rgba(251,248,241,0.15)', color: styles.ivory,
            border: 'none', padding: '10px', borderRadius: '12px',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            fontFamily: "'Manrope', sans-serif",
          }}>Перенести</button>
          <button style={{
            flex: 1, background: 'transparent', color: styles.ivory,
            border: '1px solid rgba(251,248,241,0.3)', padding: '10px', borderRadius: '12px',
            fontSize: '12px', fontWeight: 500, cursor: 'pointer',
            fontFamily: "'Manrope', sans-serif",
          }}>Отменить</button>
        </div>
      </div>

      <div style={{ fontSize: '11px', color: styles.muted, letterSpacing: '0.1em', marginBottom: '10px' }}>ИСТОРИЯ</div>
      {[
        { service: 'Релаксирующий массаж', master: 'Мали', date: '5 апр', rating: 5, done: true },
        { service: 'Чистка лица', master: 'Фон', date: '18 мар', rating: 5, done: true },
        { service: 'Оздоровительный', master: 'Нат', date: '2 мар', rating: null, done: true },
      ].map((v, i) => (
        <div key={i} style={{
          background: styles.ivory, borderRadius: '16px', padding: '16px',
          marginBottom: '8px', border: '1px solid rgba(42,46,40,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...styles.display, fontSize: '15px', color: styles.deepSage, marginBottom: '2px' }}>{v.service}</div>
            <div style={{ fontSize: '12px', color: styles.muted }}>{v.master} · {v.date}</div>
          </div>
          {v.rating ? (
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={12}
                  fill={n <= v.rating ? styles.copper : 'transparent'}
                  color={n <= v.rating ? styles.copper : 'rgba(42,46,40,0.2)'}
                />
              ))}
            </div>
          ) : (
            <button onClick={() => setScreen('feedback')}
              style={{
                background: styles.copper, color: styles.ivory,
                border: 'none', padding: '6px 12px', borderRadius: '12px',
                fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Manrope', sans-serif",
              }}>Оценить</button>
          )}
        </div>
      ))}
    </div>
  );

  // === FEEDBACK ===
  const renderFeedback = () => (
    <div>
      <button onClick={() => setScreen('bookings')}
        style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: styles.ivory, border: '1px solid rgba(42,46,40,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', marginBottom: '20px',
        }}>
        <ChevronLeft size={18} color={styles.deepSage} />
      </button>

      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: '13px', color: styles.muted, marginBottom: '8px' }}>
          Оздоровительный массаж · Нат
        </div>
        <div style={{ ...styles.display, fontSize: '30px', color: styles.deepSage, marginBottom: '12px', lineHeight: 1.2 }}>
          Как прошёл<br/>ваш ритуал?
        </div>
        <div style={{ fontSize: '13px', color: styles.muted, marginBottom: '36px' }}>
          Ваша честность помогает нам расти
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '36px' }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px', transform: rating === n ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.2s',
              }}>
              <Star size={38}
                fill={n <= rating ? styles.copper : 'transparent'}
                color={n <= rating ? styles.copper : 'rgba(42,46,40,0.25)'}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12px', color: styles.muted, letterSpacing: '0.1em', marginBottom: '10px' }}>
              {rating >= 4 ? 'ЧТО БЫЛО ОСОБЕННО ХОРОШО?' : 'ЧТО МОЖНО УЛУЧШИТЬ?'}
            </div>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder={rating >= 4 ? 'Расскажите о приятных моментах...' : 'Расскажите, что огорчило — мы всё исправим'}
              style={{
                width: '100%', minHeight: '100px',
                background: styles.ivory, border: '1px solid rgba(42,46,40,0.08)',
                borderRadius: '16px', padding: '14px',
                fontSize: '13px', fontFamily: "'Manrope', sans-serif",
                color: styles.deepSage, resize: 'none', outline: 'none',
                marginBottom: '20px', boxSizing: 'border-box',
              }}
            />

            {rating === 5 && (
              <div style={{
                background: 'linear-gradient(135deg, #E8DDC8 0%, #D4C4A8 100%)',
                borderRadius: '16px', padding: '16px', marginBottom: '16px',
              }}>
                <div style={{ ...styles.display, fontSize: '16px', color: styles.deepSage, marginBottom: '4px' }}>
                  Спасибо от души 🙏
                </div>
                <div style={{ fontSize: '12px', color: styles.deepSage, opacity: 0.8, marginBottom: '12px' }}>
                  Поделитесь впечатлением в 2GIS или Google — и получите 500 бонусов
                </div>
                <button style={{
                  width: '100%', background: styles.deepSage, color: styles.ivory,
                  border: 'none', padding: '10px', borderRadius: '12px',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'Manrope', sans-serif",
                }}>Оставить отзыв</button>
              </div>
            )}

            <button onClick={() => { setShowToast(true); setTimeout(() => { setShowToast(false); setScreen('bookings'); setRating(0); setFeedback(''); }, 1500); }}
              style={{
                width: '100%', background: styles.copper, color: styles.ivory,
                border: 'none', padding: '16px', borderRadius: '20px',
                fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 8px 24px -8px rgba(184,121,74,0.5)',
              }}>
              Отправить
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // === BONUS ===
  const renderBonus = () => (
    <div>
      <div style={{ ...styles.display, fontSize: '32px', color: styles.deepSage, marginBottom: '20px' }}>
        Бонусы
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #344237 0%, #4A5D4F 100%)',
        borderRadius: '28px', padding: '28px', marginBottom: '20px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(184,121,74,0.2)',
        }} />
        <div style={{ fontSize: '11px', color: 'rgba(251,248,241,0.7)', letterSpacing: '0.15em', marginBottom: '10px' }}>
          ВАШ БАЛАНС
        </div>
        <div style={{ ...styles.display, fontSize: '44px', color: styles.ivory, lineHeight: 1 }}>
          3 450 <span style={{ fontSize: '20px', opacity: 0.7 }}>₸</span>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(251,248,241,0.6)', marginTop: '8px' }}>
          1 бонус = 1 тенге при оплате
        </div>
      </div>

      <div style={{
        background: styles.ivory, borderRadius: '20px', padding: '20px',
        border: '1px solid rgba(42,46,40,0.05)', marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(184,121,74,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Gift size={20} color={styles.copper} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...styles.display, fontSize: '16px', color: styles.deepSage }}>
              Каждый 5-й визит
            </div>
            <div style={{ fontSize: '12px', color: styles.muted }}>
              Ещё 2 визита до подарка
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{
              flex: 1, height: '6px', borderRadius: '3px',
              background: n <= 3 ? styles.copper : 'rgba(42,46,40,0.1)',
            }} />
          ))}
        </div>
      </div>

      <div style={{
        background: styles.ivory, borderRadius: '20px', padding: '20px',
        border: '1px solid rgba(42,46,40,0.05)', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(74,93,79,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={20} color={styles.sage} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...styles.display, fontSize: '16px', color: styles.deepSage }}>
              Приведите подругу
            </div>
            <div style={{ fontSize: '12px', color: styles.muted }}>
              +2000 бонусов вам и ей
            </div>
          </div>
        </div>
        <button style={{
          width: '100%', marginTop: '8px',
          background: styles.deepSage, color: styles.ivory,
          border: 'none', padding: '10px', borderRadius: '12px',
          fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          fontFamily: "'Manrope', sans-serif",
        }}>Поделиться ссылкой</button>
      </div>

      <div style={{ fontSize: '11px', color: styles.muted, letterSpacing: '0.1em', marginBottom: '10px' }}>
        ИСТОРИЯ
      </div>
      {[
        { t: 'Начисление', v: '+1 200', date: '5 апр', s: 'Релакс массаж' },
        { t: 'Списание', v: '−2 000', date: '18 мар', s: 'Чистка лица' },
        { t: 'Начисление', v: '+900', date: '2 мар', s: 'Оздоровительный' },
      ].map((h, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 4px', borderBottom: i < 2 ? '1px solid rgba(42,46,40,0.06)' : 'none',
        }}>
          <div>
            <div style={{ fontSize: '13px', color: styles.deepSage, fontWeight: 500 }}>{h.t}</div>
            <div style={{ fontSize: '11px', color: styles.muted }}>{h.s} · {h.date}</div>
          </div>
          <div style={{
            ...styles.display, fontSize: '16px',
            color: h.v.startsWith('+') ? styles.sage : styles.copper,
          }}>{h.v}</div>
        </div>
      ))}
    </div>
  );

  // === PROFILE ===
  const renderProfile = () => (
    <div>
      <div style={{ textAlign: 'center', padding: '20px 0 28px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #E8DDC8, #B8794A)',
          margin: '0 auto 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...styles.display, fontSize: '32px', color: styles.ivory,
        }}>А</div>
        <div style={{ ...styles.display, fontSize: '22px', color: styles.deepSage }}>Айгерим</div>
        <div style={{ fontSize: '13px', color: styles.muted }}>+7 777 123 45 67</div>
      </div>

      {[
        { icon: Calendar, label: 'Дата рождения', value: '14 августа' },
        { icon: MapPin, label: 'Любимый филиал', value: 'Сатпаева' },
        { icon: Heart, label: 'Любимый мастер', value: 'Нат' },
        { icon: Bell, label: 'Уведомления', value: 'Включены' },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '16px 4px',
            borderBottom: '1px solid rgba(42,46,40,0.06)',
          }}>
            <Icon size={18} color={styles.sage} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: styles.muted, marginBottom: '2px' }}>{item.label}</div>
              <div style={{ fontSize: '14px', color: styles.deepSage, fontWeight: 500 }}>{item.value}</div>
            </div>
            <ChevronRight size={16} color={styles.muted} />
          </div>
        );
      })}

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <div style={{ ...styles.display, fontStyle: 'italic', fontSize: '13px', color: styles.muted }}>
          ขอบคุณ
        </div>
        <div style={{ fontSize: '11px', color: styles.muted, marginTop: '4px' }}>
          Спасибо, что с нами
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch(screen) {
      case 'home': return renderHome();
      case 'catalog': return renderCatalog();
      case 'booking': return renderBooking();
      case 'bookings': return renderBookings();
      case 'feedback': return renderFeedback();
      case 'bonus': return renderBonus();
      case 'profile': return renderProfile();
      default: return renderHome();
    }
  };

  return (
    <div style={styles.page}>
      <div style={{
        maxWidth: '420px', width: '100%', marginBottom: '16px',
        fontFamily: "'Fraunces', serif", textAlign: 'center',
      }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#8A8B86', marginBottom: '4px' }}>
          SHANTI THAI SPA · ПРОТОТИП
        </div>
      </div>

      <div style={styles.phoneFrame}>
        <div style={styles.statusBar}>
          <span>9:41</span>
          <span style={{ letterSpacing: '0.05em' }}>SHANTI</span>
          <span>100%</span>
        </div>

        <div style={styles.content}>
          {renderScreen()}
        </div>

        {bottomNav}

        {showToast && (
          <div style={{
            position: 'absolute', bottom: '100px', left: '50%',
            transform: 'translateX(-50%)',
            background: styles.deepSage, color: styles.ivory,
            padding: '12px 20px', borderRadius: '20px',
            fontSize: '13px', fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: "'Manrope', sans-serif",
            boxShadow: '0 10px 30px -10px rgba(42,46,40,0.4)',
            animation: 'fadeIn 0.3s',
          }}>
            <Check size={16} color={styles.copper} />
            {screen === 'feedback' ? 'Спасибо за отзыв!' : 'Запись подтверждена'}
          </div>
        )}
      </div>

      <div style={{
        maxWidth: '420px', width: '100%', marginTop: '20px',
        fontSize: '11px', color: '#8A8B86', textAlign: 'center',
        fontFamily: "'Manrope', sans-serif",
      }}>
        Тыкайте любую кнопку снизу для перехода между экранами
      </div>
    </div>
  );
}
