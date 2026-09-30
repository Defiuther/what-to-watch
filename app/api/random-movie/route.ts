import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }

  // Берём случайную страницу из популярных фильмов
  const randomPage = Math.floor(Math.random() * 20) + 1;
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ru-RU&page=${randomPage}`;

  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: 'TMDB error' }, { status: 500 });
  }

  const data = await res.json();
  const results = data.results || [];
  if (results.length === 0) {
    return NextResponse.json({ error: 'No movies' }, { status: 404 });
  }

  const randomMovie = results[Math.floor(Math.random() * results.length)];
  return NextResponse.json(randomMovie);
}