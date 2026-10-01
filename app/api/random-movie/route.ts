import { NextResponse } from 'next/server';

const MOVIE_IDS = [
  'tt0111161', 'tt0068646', 'tt0468569', 'tt0071562', 'tt0050083',
  'tt0108052', 'tt0167260', 'tt0110912', 'tt0060196', 'tt0137523',
  'tt0109830', 'tt1375666', 'tt0167261', 'tt0080684', 'tt0133093',
  'tt0099685', 'tt0073486', 'tt0114369', 'tt0317248', 'tt0102926',
  'tt0118799', 'tt0120737', 'tt0103064', 'tt0088763', 'tt0245429',
  'tt0253474', 'tt6751668', 'tt0172495', 'tt0407887', 'tt2582802',
  'tt0482571', 'tt0209144', 'tt0110413', 'tt0110357', 'tt0095327',
  'tt0057012', 'tt0078748', 'tt0081505', 'tt0075314', 'tt0086879',
  'tt0169547', 'tt2267998', 'tt0119217', 'tt0435761', 'tt2380307',
  'tt0910970', 'tt0114709', 'tt1049413', 'tt0382932', 'tt1539872',
];

export async function GET() {
  const apiKey = 'bb3bcd35';

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