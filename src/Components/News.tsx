import { useState, useEffect, MouseEvent } from 'react'
import noImg from '../assets/images/no-img.png'
import './News.css'
import { NewsModal } from './NewsModal'
import { Article } from "../types";
import { fetchNewsByCategory } from '../api/newsApi'

const categories = [
  'general',
  'world',
  'business',
  'technology',
  'entertainment',
  'sports',
  'science',
  'health',
  'nation',
] as const;

export type Category = typeof categories[number];

export const News = () => {
  const [headline, setHeadline] = useState<Article | null>(null);
  const [news, setNews] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('general');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const cacheKey = `newsData-${selectedCategory}`;
        const cacheTimeKey = `${cacheKey}-timestamp`;
        const now = Date.now();

        // check category-specific cache
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);

        // valid if exists and less than 60 minutes old
        if (cachedData && cachedTime && now - Number(cachedTime) < 60 * 60 * 1000) {
          const data = JSON.parse(cachedData) as { articles: Article[] };
          setHeadline(data.articles[0]);
          setNews(data.articles.slice(1, 7));
          return;
        }

        // otherwise fetch fresh
        const language = "en";
        const country = "us";
        const max = 7;

        const response = await fetchNewsByCategory(selectedCategory, language, country, max);
        // const response = await axios.get<{ articles: Article[] }>(url);
        const fetchedNews = response.map(article => ({
          ...article,
          image: article.image || noImg
        }));

        // save to state
        setHeadline(fetchedNews[0]);
        setNews(fetchedNews.slice(1, 7));

        // save category-specific cache
        localStorage.setItem(cacheKey, JSON.stringify(response));
        localStorage.setItem(cacheTimeKey, now.toString());
      } catch (error) {
        console.error("Error fetching headline:", error);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  const handleCategoryClick = (
    e: MouseEvent<HTMLAnchorElement>, 
    category: Category
  ) => {
    e.preventDefault();
    setSelectedCategory(category);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  return <div className='news-app'>
    <div className="news-header">
      <h1 className="logo">News App</h1>
    </div>
    <div className="news-content">
      <nav className="navbar">
        <h1 className="nav-heading">Categories</h1>
        <div className="categories">
          {categories.map((category) => (
            <a
              key={category}
              href="#"
              className={`nav-link ${selectedCategory === category ? 'active' : ''}`}
              onClick={(e) => handleCategoryClick(e, category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </a>
          ))}
        </div>
      </nav>
      <div className="news-section">
        {headline && (
          <div className="headline" onClick={() => handleArticleClick(headline)}>
            <img src={headline.image || noImg} alt={headline.title} />
            <h2 className="headline-title">{headline.title}</h2>
          </div>
        )}

        <div className="news-grid">
          {news.map((article, index) => (
            <div key={index} className="news-grid-item" onClick={() => handleArticleClick(article)}>
              <img src={article.image || noImg} alt={article.title} />
              <h3>{article.title}</h3>
            </div>
          ))}
        </div>
      </div>
      <NewsModal show={showModal} article={selectedArticle} onClose={() => setShowModal(false)}/>
    </div>
    <footer>
      <div className="copyright">
        <span>News App</span>
      </div>
      <small>&copy; All Rights Reserved.</small>
    </footer>
  </div>
}
