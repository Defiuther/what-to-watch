'use client';

import { useState } from 'react';

type Movie = {
  id: string;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export default function Home() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  
  const [genre, setGenre] = useState('any');
  const [year, setYear] = useState('any');
  const [rating, setRating] = useState('0');

  async function getRandomMovie() {
    setLoading(true);
    setError(null);
    setImgFailed(false);
    try {
      const params = new URLSearchParams({ genre, year, rating });
      const res = await fetch(`/api/random-movie?${params}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Ошибка загрузки 😢');
        setMovie(null);
        return;
      }
      
      setMovie(data);
    } catch (e) {
      setError('Не удалось загрузить фильм 😢');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">🎬 Что посмотреть?</h1>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-3 mb-6 w-full max-w-2xl justify-center">
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 text-white"
        >
          <option value="any">🎭 Любой жанр</option>
          <option value="action">💥 Боевик</option>
          <option value="comedy">😂 Комедия</option>
          <option value="drama">🎭 Драма</option>
          <option value="thriller">🔪 Триллер</option>
          <option value="crime">🕵️ Криминал</option>
          <option value="fantasy">🚀 Фантастика</option>
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 text-white"
        >
          <option value="any">📅 Любой год</option>
          <option value="1900-1980">📼 До 1980</option>
          <option value="1980-2000">📺 1980-2000</option>
          <option value="2000-2010">💿 2000-2010</option>
          <option value="2010-2025">🆕 2010+</option>
        </select>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 text-white"
        >
          <option value="0">⭐ Любой рейтинг</option>
          <option value="7">⭐ 7+</option>
          <option value="8">⭐ 8+</option>
          <option value="8.5">🌟 8.5+</option>
          <option value="9">💎 9+</option>
        </select>
      </div>

      {!movie && !loading && (
        <button
          onClick={getRandomMovie}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-xl font-semibold transition"
        >
          🎲 Подобрать фильм
        </button>
      )}

      {loading && <p className="text-zinc-400">Загружаем...</p>}

      {error && (
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={getRandomMovie}
            className="px-6 py-3 bg-purple-600 rounded-xl"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {movie && !loading && (
        <div className="max-w-md w-full bg-zinc-900 rounded-2xl overflow-hidden shadow-xl">
          {movie.poster_path && !imgFailed ? (
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-full h-auto"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="h-64 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-7xl">
              🎬
            </div>
          )}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
            <p className="text-sm text-zinc-400 mb-4">
              {movie.release_date?.slice(0, 4)} · ⭐ {movie.vote_average.toFixed(1)}
            </p>
            <p className="text-zinc-300 text-sm mb-6 line-clamp-4">
              {movie.overview || 'Описание отсутствует'}
            </p>
            <button
              onClick={getRandomMovie}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
            >
              🎲 Ещё один
            </button>
          </div>
        </div>
      )}
    </main>
  );
}