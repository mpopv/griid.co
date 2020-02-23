const fetch = require("node-fetch");

exports.handler = function subreddit(event, context, callback) {
  const limit = event.queryStringParameters.limit || 12;
  const name = event.queryStringParameters.name || "Pics";
  const after = event.queryStringParameters.after || "";
  const sort = event.queryStringParameters.sort || "";
  const t = event.queryStringParameters.t || "";

  // prettier-ignore
  const url = `https://www.reddit.com/r/${name}.json?limit=${limit}${after ? `&after=${after}` : ""}${sort ? `&sort=${sort}` : ""}${t ? `&t=${t}` : ""}`;

  (async () => {
    let res;
    let json;
    try {
      res = await fetch(url);
      json = await res.json();
    } catch (err) {
      callback({ statusCode: 422, body: String(err) });
    }

    const posts = json.data.children.map(p => ({
      title: p.data.title,
      thumbnail: p.data.thumbnail,
      permalink: p.data.permalink,
      url: p.data.url
    }));

    const data = {
      subreddit: json.data.children.length
        ? json.data.children[0].data.subreddit
        : "",
      posts,
      after: json.data.after
    };

    callback(null, {
      statusCode: 200,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
  })();
};
