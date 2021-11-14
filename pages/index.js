import Head from "next/head";
import React from "react";

import Select from "react-select";
import fs from "fs";
import path from "path";

// read blog data from blogs.csv
function loadBlogs() {
  const filePath = path.join(process.cwd(), "blogs.csv");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const blogs = fileContents.split("\n").map((s) => {
    const a = s.split(",");
    return { label: a[0], value: a[1] };
  });
  // order by label
  blogs.sort((a, b) => a.label.localeCompare(b.label));
  return blogs;
}

function getGoogleSearchQuery(term, sites) {
  return encodeURI(
    `https://google.com/search?q=${term} (${sites
      .map((site) => `site:${site}`)
      .join(" OR ")})`
  );
}

function buttonDisabled(term, sites) {
  if (!term) {
    return true;
  }
  if (sites.length == 0) {
    return true;
  }
  return false;
}

const Button = ({ disabled, query }) => {
  if (disabled) {
    return (
      <button className="text-2xl font-bold text-gray-300 hover:none" disabled>
        Search !
      </button>
    );
  } else {
    return (
      <button
        className="text-2xl font-bold hover:bg-black hover:text-white"
        onClick={(e) => window.open(query)}
      >
        Search !
      </button>
    );
  }
};

// TODO: understand and cleanup class names
// TODO: how to leave comments
export default function Home({ blogs }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedBlogs, setSelectedBlogs] = React.useState(blogs);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Head>
        <title>How X Do Y</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center flex-1 w-1/4">
        <div className="w-full">
          <p className="my-3 text-2xl font-bold">How</p>
          <Select
            defaultValue={blogs.slice(0, 2)}
            isMulti
            name="blogs"
            options={blogs}
            classNamePrefix="select"
            onChange={(selected) => {
              setSelectedBlogs(selected);
            }}
          />
          <p className="my-3 text-2xl font-bold">Do</p>
          <div className="flex flex-col">
            <input
              className="border border-gray-300 rounded px-3 h-10"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="my-3">
            <Button
              disabled={buttonDisabled(searchTerm, selectedBlogs)}
              query={getGoogleSearchQuery(
                searchTerm,
                selectedBlogs.map((blog) => blog.value)
              )}
            />
          </div>
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

export async function getStaticProps() {
  const blogs = loadBlogs();
  return {
    props: {
      blogs: blogs,
    },
  };
}
