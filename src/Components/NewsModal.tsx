import './NewsModal.css'

type Article = {
  image: string;
  title: string;
  source: { name: string };
  publishedAt: string;
  content: string;
  url: string;
};

type NewsModalProps = {
  show: boolean;
  article: Article | null;
  onClose: () => void;
};

export const NewsModal: React.FC<NewsModalProps> = ({ show, article, onClose }) => {
  if (!show) {
    return null;
  }
  return <div className="modal-overlay">
    <div className="modal-content">
      <span className="close-button" onClick={onClose}>
        <i className="fa-solid fa-xmark"></i>
      </span>

      {/* Article content */}
      {article && (
        <>
          <img src={article.image} alt={article.title} className="modal-image" />
          <h2 className="modal-title">{article.title}</h2>
          <p className="modal-source">Source: {article.source.name}</p>
          <p className="modal-date">
            {new Date(article.publishedAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="modal-content-text">{article.content}</p>
          <a
            href={article.url}
            className="read-more-link"
            target="_blank"
            rel="noopener noreferrer">
            Read More
          </a>
        </>
      )}
    </div>
  </div>

}
