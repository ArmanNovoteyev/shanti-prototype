import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import ru from '../locales/ru.json';
import kk from '../locales/kk.json';
import en from '../locales/en.json';

const locales = { ru, kk, en };

export function useTranslation() {
  const { lang, setLang } = useContext(AppContext);

  const t = (key, vars) => {
    const dict = locales[lang] || locales.ru;
    let value = key.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), dict);
    if (value == null) {
      value = key.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), locales.ru);
    }
    if (typeof value !== 'string') return key;
    if (vars) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, name) =>
        vars[name] != null ? String(vars[name]) : '',
      );
    }
    return value;
  };

  const localized = (item, field) => {
    if (!item) return '';
    return item[`${field}_${lang}`] || item[`${field}_ru`] || '';
  };

  return { t, lang, setLang, localized };
}
