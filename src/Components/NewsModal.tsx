import './NewsModal.css'
import { Article } from "../types";

type NewsModalProps = {
  show: boolean;
  article: Article | null;
  onClose: () => void;
};

export const NewsModal: React.FC<NewsModalProps> = ({ show, article, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>

        {/* Article content */}
        {article && (
          <>
            {/* Image */}
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="modal-image" 
              />
            )}

            {/* Title */}
            <h2 className="modal-title">{article.title}</h2>

            {/* Source */}
            {article.source?.name && (
              <p className="modal-source">Source: {article.source.name}</p>
            )}

            {/* Published Date */}
            {article.publishedAt && (
              <p className="modal-date">
                {new Date(article.publishedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}

            {/* Content */}
            {article.content && (
              <p className="modal-content-text">{article.content}</p>
            )}

            {/* Read More Link */}
            {article.url && (
              <a
                href={article.url}
                className="read-more-link"
                target="_blank"
                rel="noopener noreferrer">
                Read More
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
