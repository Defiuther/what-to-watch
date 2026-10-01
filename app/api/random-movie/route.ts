import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// База фильмов: ID, жанр, год, рейтинг
const MOVIES = [
  // Драмы
  { id: 'tt0111161', genre: 'drama', year: 1994, rating: 9.3 },
  { id: 'tt0068646', genre: 'drama', year: 1972, rating: 9.2 },
  { id: 'tt0071562', genre: 'drama', year: 1974, rating: 9.0 },
  { id: 'tt0108052', genre: 'drama', year: 1993, rating: 9.0 },
  { id: 'tt0109830', genre: 'drama', year: 1994, rating: 8.8 },
  { id: 'tt0118799', genre: 'drama', year: 1997, rating: 8.6 },
  { id: 'tt0253474', genre: 'drama', year: 2002, rating: 8.5 },
  { id: 'tt0169547', genre: 'drama', year: 1999, rating: 8.3 },
  { id: 'tt2267998', genre: 'drama', year: 2014, rating: 8.1 },
  { id: 'tt2582802', genre: 'drama', year: 2014, rating: 8.5 },
  
  // Боевики
  { id: 'tt0468569', genre: 'action', year: 2008, rating: 9.0 },
  { id: 'tt0133093', genre: 'action', year: 1999, rating: 8.7 },
  { id: 'tt0103064', genre: 'action', year: 1991, rating: 8.6 },
  { id: 'tt0172495', genre: 'action', year: 2000, rating: 8.5 },
  { id: 'tt0407887', genre: 'action', year: 2006, rating: 8.5 },
  { id: 'tt0110413', genre: 'action', year: 1994, rating: 8.5 },
  { id: 'tt0078748', genre: 'action', year: 1979, rating: 8.5 },
  { id: 'tt1375666', genre: 'action', year: 2010, rating: 8.8 },
  { id: 'tt0075314', genre: 'action', year: 1976, rating: 8.2 },
  
  // Комедии
  { id: 'tt0110912', genre: 'comedy', year: 1994, rating: 8.9 },
  { id: 'tt0099685', genre: 'comedy', year: 1990, rating: 8.7 },
  { id: 'tt0209144', genre: 'comedy', year: 2000, rating: 8.4 },
  { id: 'tt0088763', genre: 'comedy', year: 1985, rating: 8.5 },
  { id: 'tt0086879', genre: 'comedy', year: 1984, rating: 8.3 },
  { id: 'tt0057012', genre: 'comedy', year: 1964, rating: 8.4 },
  
  // Фантастика
  { id: 'tt0167260', genre: 'fantasy', year: 2003, rating: 9.0 },
  { id: 'tt0167261', genre: 'fantasy', year: 2002, rating: 8.8 },
  { id: 'tt0120737', genre: 'fantasy', year: 2001, rating: 8.9 },
  { id: 'tt0080684', genre: 'fantasy', year: 1980, rating: 8.7 },
  { id: 'tt0245429', genre: 'fantasy', year: 2001, rating: 8.6 },
  
  // Триллеры
  { id: 'tt0137523', genre: 'thriller', year: 1999, rating: 8.8 },
  { id: 'tt0114369', genre: 'thriller', year: 1995, rating: 8.6 },
  { id: 'tt0102926', genre: 'thriller', year: 1991, rating: 8.6 },
  { id: 'tt0482571', genre: 'thriller', year: 2006, rating: 8.5 },
  { id: 'tt6751668', genre: 'thriller', year: 2019, rating: 8.5 },
  
  // Криминал
  { id: 'tt0060196', genre: 'crime', year: 1966, rating: 8.8 },
  { id: 'tt0317248', genre: 'crime', year: 2002, rating: 8.6 },
  { id: 'tt0073486', genre: 'crime', year: 1975, rating: 8.7 },
  { id: 'tt0050083', genre: 'crime', year: 1957, rating: 8.9 },
  { id: 'tt0095327', genre: 'crime', year: 1988, rating: 8.5 },
];

export async function GET(request: NextRequest) {
  const apiKey = 'bb3bcd35';
  const { searchParams } = new URL(request.url);
  
  const genre = searchParams.get('genre') || 'any';
  const yearRange = searchParams.get('year') || 'any';
  const minRating = parseFloat(searchParams.get('rating') || '0');

  // Фильтруем список
  let filtered = MOVIES.filter((m) => {
    // Жанр
    if (genre !== 'any' && m.genre !== genre) return false;
    
    // Год
    if (yearRange !== 'any') {
      const [min, max] = yearRange.split('-').map((y) => parseInt(y) || 9999);
      if (m.year < min || m.year > max) return false;
    }
    
    // Рейтинг
    if (m.rating < minRating) return false;
    
    return true;
  });

  // Если ничего не нашли
  if (filtered.length === 0) {
    return NextResponse.json(
      { error: 'Нет фильмов с такими фильтрами 😢' },
      { status: 404 }
    );
  }

  // Случайный из подходящих
  const randomMovie = filtered[Math.floor(Math.random() * filtered.length)];
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${randomMovie.id}&plot=short&language=ru`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'OMDb error' }, { status: 500 });
    }

    const data = await res.json();
    if (data.Response === 'False') {
      return NextResponse.json({ error: data.Error || 'Movie not found' }, { status: 404 });
    }

    let posterUrl: string | null = null;
    if (data.Poster && data.Poster !== 'N/A') {
      const cleanUrl = data.Poster.replace('https://', '').replace('http://', '');
      posterUrl = `https://images.weserv.nl/?url=${cleanUrl}`;
    }

    const movie = {
      id: data.imdbID,
      title: data.Title,
      overview: data.Plot,
      poster_path: posterUrl,
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