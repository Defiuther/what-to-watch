import { NextResponse } from 'next/server';

// Список IMDb ID фильмов — из них случайно выбираем
const MOVIE_IDS = [
  'tt0111161', // Побег из Шоуshенка
  'tt0068646', // Крёстный отец
  'tt0468569', // Тёмный рыцарь
  'tt0071562', // Крёстный отец 2
  'tt0050083', // 12 разгневанных мужчин
  'tt0108052', // Список Шиндлера
  'tt0167260', // Властелин колец: Возвращение короля
  'tt0110912', // Криминальное чтиво
  'tt0060196', // Хороший, плохой, злой
  'tt0137523', // Бойцовский клуб
  'tt0109830', // Форрест Гамп
  'tt1375666', // Начало
  'tt0167261', // Властелин колец: Две крепости
  'tt0080684', // Звёздные войны: Империя наносит ответный удар
  'tt0133093', // Матрица
  'tt0099685', // Славные парни
  'tt0073486', // Пролетая над гнездом кукушки
  'tt0114369', // Семь
  'tt0047478', // Семь самураев
  'tt0317248', // Город Бога
  'tt0102926', // Молчание ягнят
  'tt0038650', // Эта прекрасная жизнь
  'tt0118799', // Жизнь прекрасна
  'tt0120737', // Властелин колец: Братство кольца
  'tt0103064', // Терминатор 2
  'tt0088763', // Назад в будущее
  'tt0245429', // Унесённые призраками
  'tt0253474', // Пианист
  'tt6751668', // Паразиты
  'tt0172495', // Гладиатор
  'tt0407887', // Отступники
  'tt2582802', // Одержимость
  'tt0482571', // Престиж
  'tt0209144', // Помни
  'tt0110413', // Леон
  'tt0110357', // Король Лев
  'tt0095327', // Могила светлячков
  'tt0095765', // Кино
  'tt0057012', // Доктор Стрейнджлав
  'tt0078748', // Чужой
  'tt0081505', // Сияние
  'tt0032138', // Волшебник страны Оз
  'tt0056058', // Харакири
  'tt0053291', // В джазе только девушки
  'tt0047396', // Окно во двор
  'tt0075314', // Таксист
  'tt0086879', // Амадей
  'tt0169547', // Красота по-американски
  'tt2267998', // Исчезнувшая
];

export async function GET() {
  const apiKey = 'bb3bcd35'; // Твой OMDb ключ

  // Берём случайный ID
  const randomId = MOVIE_IDS[Math.floor(Math.random() * MOVIE_IDS.length)];
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${randomId}&plot=short&language=ru`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'OMDb error' }, { status: 500 });
    }

    const data = await res.json();
    if (data.Response === 'False') {
      return NextResponse.json({ error: data.Error || 'Movie not found' }, { status: 404 });
    }

    // Преобразуем в формат, который понимает наш фронтенд
    const movie = {
      id: data.imdbID,
      title: data.Title,
      overview: data.Plot,
      poster_path: data.Poster !== 'N/A' ? data.Poster : null,
      release_date: data.Year,
      vote_average: parseFloat(data.imdbRating) || 0,
    };

    return NextResponse.json(movie);
  } catch (e) {
    return NextResponse.json(
      { error: 'Request failed', details: String(e) },
      { status: 500 }
    );
  }
}