const PREFIX = 'vaxx.tw';

export const getCache = (key) => {
  const data = window.localStorage.getItem(`${PREFIX}_${key}`);
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

export const setCache = (key, value) => {
  const data = typeof value === 'object' ? JSON.stringify(value) : value;
  return window.localStorage.setItem(`${PREFIX}_${key}`, data);
};
