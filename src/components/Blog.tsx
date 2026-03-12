import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import frontMatter from 'front-matter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Blog.css';

// Import raw markdown files using Vite's eager glob
const postFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

interface PostAttributes {
  title: string;
  subtitle: string;
  date: string;
}

interface Post {
  id: string;
  attributes: PostAttributes;
  body: string;
}

export function Blog() {
  const posts = useMemo(() => {
    const loadedPosts: Post[] = [];
    
    for (const path in postFiles) {
      const rawContent = postFiles[path] as string;
      const parsed = frontMatter<PostAttributes>(rawContent);
      loadedPosts.push({
        id: path,
        attributes: parsed.attributes,
        body: parsed.body,
      });
    }

    // Sort by date descending (newest first)
    return loadedPosts.sort((a, b) => {
      return new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime();
    });
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (posts.length === 0) {
    return null;
  }

  const currentPost = posts[currentIndex];
  // Note: Older posts have a higher index since we sorted newest first.
  const hasOlder = currentIndex < posts.length - 1;
  const hasNewer = currentIndex > 0;

  const goToOlder = () => {
    if (hasOlder) setCurrentIndex((prev: number) => prev + 1);
  };

  const goToNewer = () => {
    if (hasNewer) setCurrentIndex((prev: number) => prev - 1);
  };

  return (
    <div className="blog-container">
      <div className="blog-content">
        <header className="blog-header">
          <h2>{currentPost.attributes.title}</h2>
          {currentPost.attributes.subtitle && (
            <h3 className="blog-subtitle">{currentPost.attributes.subtitle}</h3>
          )}
          <time className="blog-date">
            {new Date(currentPost.attributes.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </header>
        
        <div className="blog-body">
          <ReactMarkdown>{currentPost.body}</ReactMarkdown>
        </div>

        {posts.length > 1 && (
          <nav className="blog-nav">
            <button 
              onClick={goToOlder} 
              disabled={!hasOlder}
              className={`nav-button ${!hasOlder ? 'disabled' : ''}`}
              aria-label="Older post"
            >
              <ChevronLeft size={24} />
              <span>Older</span>
            </button>
            <button 
              onClick={goToNewer} 
              disabled={!hasNewer}
              className={`nav-button ${!hasNewer ? 'disabled' : ''}`}
              aria-label="Newer post"
            >
              <span>Newer</span>
              <ChevronRight size={24} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
