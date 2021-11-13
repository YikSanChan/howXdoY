import Head from "next/head";
import React from "react";

import Select from "react-select";

// TODO: load static file
const data = `Uber,eng.uber.com
Airbnb,medium.com/airbnb-engineering
Lyft,eng.lyft.com`;

const blogs = data.split("\n").map((s) => {
  const a = s.split(",");
  return { label: a[0], value: a[1] };
});

// TODO: it makes no sense when sites=[]
function getGoogleSearchQuery(term, sites) {
  return encodeURI(
    `https://google.com/search?q=${term} (${sites
      .map((site) => `site:${site}`)
      .join(" OR ")})`
  );
}

export default function Home() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedBlogs, setSelectedBlogs] = React.useState(blogs);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>How X Do Y</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-20">
        <h1 className="text-6xl font-bold">
          Welcome to <a className="text-blue-600">How X Do Y</a>
        </h1>

        <div className="w-full">
          <p>How</p>
          <Select
            defaultValue={blogs}
            isMulti
            name="blogs"
            options={blogs}
            classNamePrefix="select"
            onChange={(selected) => {
              setSelectedBlogs(selected);
            }}
          />
          <p>Do</p>
          <div className="flex flex-col">
            <input
              className="border border-gray-300 rounded px-2 h-10"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p>
            <a className="text-blue-600" href={getGoogleSearchQuery(
              searchTerm,
              selectedBlogs.map((blog) => blog.value)
            )}>Go!</a>
          </p>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://yiksanchan.com/"
        >
          Built by yiksanchan
        </a>
      </footer>
    </div>
  );
}
