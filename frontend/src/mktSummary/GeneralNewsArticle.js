import React, { useState } from "react";
import "../news/Article.css";

const GeneralNewsArticle = ({ data }) => {
  const [expand, setExpand] = useState(false);

  function handleDetails() {
    if (!expand) setExpand(true);
    else setExpand(false);
  }

  const source = `${data.summary} `;

  return (
    <div className="Article">
      <h5 className="Article-title" onClick={handleDetails}>
        {data.headline}
      </h5>
      <div className="Article-source">
        {expand ? (
          <div>
            {source}
            <a className="Article-link" target="_blank" rel="noopener noreferrer" href={data.url}>Full Article</a>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default GeneralNewsArticle;
