import React, { useState, useEffect, use } from 'react'
import techImg from '../assets/images/tech.jpg'
import worldImg from '../assets/images/world.jpg'
import sportsImg from '../assets/images/sports.jpg'
import scienceImg from '../assets/images/science.jpg'
import healthImg from '../assets/images/health.jpg'
import entertainmentImg from '../assets/images/entertainment.jpg'
import nationImg from '../assets/images/nation.jpg'
import noImg from '../assets/images/no-img.png'
import './News.css'
import axios from 'axios'

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
]

export const News = () => {
  const [headline, setHeadline] = useState(null)
  const [news, setNews] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('general')

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
        if (cachedData && cachedTime && now - cachedTime < 60 * 60 * 1000) {
          const data = JSON.parse(cachedData);
          setHeadline(data.articles[0]);
          setNews(data.articles.slice(1, 7)); 
          return;
        }

        // otherwise fetch fresh
        const apikey = import.meta.env.VITE_GNEWS_API_KEY;
        const language = "en";
        const country = "us";
        const max = 7;
        const url = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=${language}&country=${country}&max=${max}&apikey=${apikey}`;

        const response = await axios.get(url);
        const fetchedNews = response.data.articles;

        fetchedNews.forEach(article => {
          if (!article.image) {
            article.image = noImg;
          }
        });

        // save to state
        setHeadline(fetchedNews[0]);
        setNews(fetchedNews.slice(1, 7));

        // save category-specific cache
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        localStorage.setItem(cacheTimeKey, now.toString());
      } catch (error) {
        console.error("Error fetching headline:", error);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    setSelectedCategory(category);
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
          <div className="headline">
          <img src={headline.image || noImg} alt={headline.title} />
          <h2 className="headline-title">{headline.title}</h2>
        </div>
        )}

      </div>
      <div className="news-grid">
        {news.map((article, index) => (
          <div key={index} className="news-grid-item">
            <img src={article.image || noImg} alt={article.title} />
            <h3>{article.title}</h3>
          </div>
        ))}
      </div>
    </div>
    <footer>
      <div className="copyright">
        <span>News App</span>
        <small>&copy; All Rights Reserved.</small>
      </div>
    </footer>
  </div>
}
