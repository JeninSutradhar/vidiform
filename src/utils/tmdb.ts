const API_KEY = 'YOUR_TMDB_API_KEY'; // In production, use environment variables

export async function fetchMovieMetadata(title: string) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
    );
    const data = await response.json();
    if (data.results?.[0]) {
      const movie = data.results[0];
      return {
        title: movie.title,
        year: new Date(movie.release_date).getFullYear(),
        genre: movie.genre_ids[0], // In production, map this to actual genre names
        description: movie.overview
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie metadata:', error);
    return null;
  }
}