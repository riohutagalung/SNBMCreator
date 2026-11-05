import { Link } from 'react-router';
import { articles } from '@/data/content';
export function ArticleContent({article}:{article:typeof articles[number]}){return <main className="page-rail article-page"><Link className="text-link" to="/blog">← Semua insight</Link><span className="eyebrow">{article.tag} / {article.date}</span><h1>{article.title}</h1><p className="page-intro">{article.excerpt}</p><div className="article-body">{article.paragraphs.map(p=><p key={p}>{p}</p>)}</div><Link className="button" to="/kontak">Diskusikan strategi brand Anda →</Link></main>;}
