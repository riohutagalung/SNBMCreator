import { Link } from 'react-router';
import { useLanguage } from '@/lib/language';
import { articleImage, articleText, type Article } from '@/lib/articles';

function ArticleBody({ body }: { body: string }) {
  return <div className="article-body">
    {body.split(/\n\s*\n/).map((block, index) => {
      const line = block.trim();
      if (!line) return null;
      if (line.startsWith('## ')) return <h2 key={index}>{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={index}>{line.slice(4)}</h3>;
      if (line.startsWith('- ')) return <ul key={index}>{line.split('\n').map((item,i)=><li key={i}>{item.replace(/^-\s*/, '')}</li>)}</ul>;
      return <p key={index} style={{whiteSpace:'pre-line'}}>{line}</p>;
    })}
  </div>;
}

export function ArticleContent({article}: {article: Article}) {
 const {pick,en}=useLanguage();
 const copy=articleText(article,en);
 const cover=articleImage(article.image_url);
 return <main className="page-rail article-page">
   <Link className="text-link" to="/blog">← {pick('Semua artikel','All articles')}</Link>
   <span className="eyebrow">{copy.tag} / {copy.date}</span>
   <h1>{copy.title}</h1>
   <p className="page-intro">{copy.excerpt}</p>
   {cover && <figure className="article-cover">
     <img src={cover} alt={article.image_alt || copy.title} width={1200} height={630}/>
   </figure>}
   <ArticleBody body={copy.body}/>
   <Link className="button" to="/kontak?jenis=brand">{pick('Diskusikan kebutuhan brand','Discuss your brand needs')}</Link>
 </main>;
}
