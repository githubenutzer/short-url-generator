import api from '../Api.js';

export const handleRegister = async (username, password, fullName, setError, navigate) => {
  try {
    const response = await api.post('/register', {
      username,
      password,
      full_name: fullName,
    });

    console.log('Реєстрація пройшла успішно', response.data);

    const loginResponse = await api.post('/login', new URLSearchParams({
      username,
      password,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    localStorage.setItem('token', loginResponse.data.access_token);
    console.log('Токен збережено');

    navigate('/short-url-generator');
  } catch (err) {
    setError('Цей логін вже зайнятий чи інша помилка');
  }
};



export const loginUser = async (username, password, setError, navigate) => {
  try {
    const response = await api.post('/login', new URLSearchParams({
      username,
      password,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    localStorage.setItem('token', response.data.access_token);
    console.log('Авторизація пройшла успішно');
    navigate('/short-url-generator');
    return response.data;
  } catch (err) {
    setError('Невірний логін чи пароль');
  }
};


export const shortenUrl = async (url) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Токен відсутній у localStorage');
    throw new Error('Необхідна авторизація. Токен відсутній.');
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const body = {
      url,
    };

    const response = await api.post('/me/urls', body, { headers });

    console.log('orig url', url)
    console.log('Скорочено URL:', response.data.short);
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error('Сервер повернув помилку:', {
        статус: err.response.status,
        дані: err.response.data,
      });
    } else {
      console.error('Мережева або інша помилка:', err.message);
    }
    throw err;
  }
};

export const getUserUrls = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Необхідна авторизація');
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get('/me/urls', { headers });
    return response.data;
  } catch (err) {
    console.error('Не вдалося отримати URL:', err);
    throw err;
  }
};

export const getUserName = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Необхідна авторизація');
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get('/me', { headers });
    return response.data;
  } catch (err) {
    console.error('Не вдалося отримати URL:', err);
    throw err;
  }
};

export const fetchLinkRedirects = async (short) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Необхідна авторизація. Токен відсутній.');
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get(`/me/links/${short}/redirects`, { headers });

    console.log('Response data:', response.data);

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (err) {
    console.error('Помилка при отриманні кількості переходів:', err);
    throw err;
  }
};
