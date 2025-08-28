export interface Article {
  id: string;
  title: string;
  description?: string;
  url: string;
  image?: string | null;
  lang: string;
  publishedAt: string;
  content: string;
  source: {
    id: string;
    name: string;
    url: string;
    country: string;
  };
}