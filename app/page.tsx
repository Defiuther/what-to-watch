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

  async function getRandomMovie() {
    setLoading(true);
    setError(null);
    setImgFailed(false);
    try {
      const res = await fetch('/api/random-movie');
      if (!res.ok) throw new Error('Ошибка запроса');
      const data = await res.json();
      setMovie(data);
    } catch (e) {
      setError('Не удалось загрузить фильм 😢');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8">🎬 Что посмотреть?</h1>

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