import React, { useState, useEffect } from "/web_modules/react.js";

const Post = ({ title, thumbnail, permalink, url }) => {
  const [src, setSrc] = useState(thumbnail);

  useEffect(() => {
    setSrc(thumbnail);
  }, [thumbnail]);

  if (!src) return <></>;

  return (
    <>
      <img
        style={{ display: "none" }}
        alt=""
        src={url}
        onLoad={() => {
          setSrc(url);
        }}
        onError={() => {
          setSrc("");
        }}
      />
      <div className="post">
        <img
          className="post__image"
          src={src}
          alt={title}
          onError={() => {
            setSrc("");
          }}
        />
        <div className="post__content">
          <p className="post__title">{title}</p>
          <a
            className="post__button post__button--comments"
            href={`https://www.reddit.com/${permalink}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open comments on Reddit"
          >
            <span aria-hidden="true">💬</span>
          </a>
          <a
            className="post__button post__button--full-size"
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open full image"
          >
            <span aria-hidden="true">🔎</span>
          </a>
        </div>
      </div>
    </>
  );
};
export default Post;
