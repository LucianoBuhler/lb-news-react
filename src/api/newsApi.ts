import { Article } from "../types";

interface NewsApiResponse {
  totalArticles: number;
  articles: Article[];
}

export const fetchNewsByCategory = async (
  category: string,
  language: string = "en",
  country: string = "us",
  max: number = 7
): Promise<Article[]> => {
  const apikey = import.meta.env.VITE_GNEWS_API_KEY;
  if (!apikey) {
    throw new Error('API key is missing');
  }

  const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${language}&country=${country}&max=${max}&apikey=${apikey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    return data.articles as Article[];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
