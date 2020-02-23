import React, { useState, useEffect, useRef } from "/web_modules/react.js";
import Post from "./Post.js";
import subreddits from "./subreddits.js";

// const sortings = [
//   ...["hot", "new", "rising", "gilded"].map(sort => ({
//     name: sort,
//     value: `&sort=${sort}`
//   })),
//   ...["top", "controversial"].reduce(
//     (sortsAcc, sort) => [
//       ...sortsAcc,
//       ...["hour", "day", "week", "month", "year", "all"].map(time => ({
//         name: `${sort}: ${time}`,
//         value: `&sort=${sort}&t=${time}`
//       }))
//     ],
//     []
//   )
// ];

const opts = {
  rootMargin: `500px`,
  threshold: 0
};

// Helper function - if fetch errors, retry up to n times
const fetchRetry = async (url, n) => {
  try {
    return await fetch(url);
  } catch (err) {
    if (n === 1) {
      console.log(err);
      return;
    }
    return await fetchRetry(url, n - 1);
  }
};

const App = () => {
  const [activeSubreddit, setActiveSubreddit] = useState("Pics");
  const [posts, setPosts] = useState([]);
  const [after, setAfter] = useState("");
  const [sort, setSort] = useState(`&sort=hot`);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadMorePosts = entries => {
      const target = entries[0];
      if (target.isIntersecting && after && !isLoading) {
        setIsLoading(true);
        (async () => {
          const res = await fetchRetry(
            `/.netlify/functions/subreddit?name=${activeSubreddit}&after=${after}${sort}`,
            5
          );
          setIsLoading(false);
          const { subreddit, posts: newPosts, after: a } = await res.json();
          setPosts([...posts, ...newPosts]);
          setAfter(a);
        })();
      }
    };
    const observer = new IntersectionObserver(loadMorePosts, opts);
    if (scrollRef && scrollRef.current) observer.observe(scrollRef.current);
    return () => observer.unobserve(scrollRef.current);
  }, [scrollRef, after, activeSubreddit, sort]);

  useEffect(() => {
    if (!activeSubreddit) return;
    (async () => {
      try {
        const res = await fetchRetry(
          `/.netlify/functions/subreddit?name=${activeSubreddit}${sort}`,
          5
        );
        const { posts: p, after: a } = await res.json();
        setPosts(p);
        setAfter(a);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [activeSubreddit, sort]);

  return (
    <>
      <nav>
        <h1>Griid</h1>

        <div>
          <select
            aria-label="Select a subreddit"
            tabindex="0"
            value={activeSubreddit}
            onChange={e => {
              setAfter("");
              setIsLoading(false);
              setActiveSubreddit(e.target.value);
              window.scrollTo(0, 0);
            }}
          >
            {subreddits.map(subreddit => (
              <option value={subreddit}>{subreddit}</option>
            ))}
          </select>

          {/* TODO: Implement Sort by select */}

          {/* <select
            aria-label="Sort by"
            tabindex="0"
            value={sort}
            onChange={e => {
              setAfter("");
              setIsLoading(false);
              setSort(e.target.value);
              window.scrollTo(0, 0);
            }}
          >
            {sortings.map(sorting => (
              <option value={sorting.value}>{sorting.name}</option>
            ))}
          </select> */}
        </div>
      </nav>

      <main>
        <div className="posts-grid">
          {posts.map(post => (
            <Post
              tabindex="0"
              title={post.title}
              thumbnail={post.thumbnail}
              permalink={post.permalink}
              url={post.url}
            />
          ))}
        </div>
      </main>

      <div className={`scroll-zone ${isLoading && "loading"}`} ref={scrollRef}>
        <img src="/assets/loading.svg" alt="" />
      </div>
    </>
  );
};
export default App;
