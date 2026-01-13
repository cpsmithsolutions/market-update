import React, { useState } from "react";
import "./Article.css";
const Article = ({ data }) => {
  const [expand, setExpand] = useState(false);

  const shortenedDate = new Date(data.datetime * 1000).toLocaleDateString();
  const description = `${data.summary} `;

  function handleDetails() {
    if (!expand) setExpand(true);
    else setExpand(false);
  }

  return (
    <div className="Article">
      <a aria-label="See Article" className="Article-link" href={data.link}>
        <div className="Article-date"> {shortenedDate}</div>
      </a>
      <h5 className="Article-title" onClick={handleDetails}>
        {data.headline}
      </h5>
      <div className="Article-description">
        {expand ? (
          <div>
            {" "}
            {description}
            <a className="Article-link" target="_blank" rel="noopener noreferrer" href={data.link}>Full Article</a>{" "}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Article;
