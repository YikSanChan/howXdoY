import Head from "next/head";
import React from "react";

import Select from "react-select";
import fs from "fs";
import path from "path";

// read blog data from blogs.csv
function loadBlogs() {
  const filePath = path.join(process.cwd(), "blogs.csv");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return fileContents.split("\n").map((s) => {
    const a = s.split(",");
    return { label: a[0], value: a[1] };
  });
}

// TODO: it makes no sense when sites=[]
function getGoogleSearchQuery(term, sites) {
  return encodeURI(
    `https://google.com/search?q=${term} (${sites
      .map((site) => `site:${site}`)
      .join(" OR ")})`
  );
}

// TODO: understand and cleanup class names
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
              className="border border-gray-300 rounded px-3 h-10"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <a
            className="text-blue-600"
            href={getGoogleSearchQuery(
              searchTerm,
              selectedBlogs.map((blog) => blog.value)
            )}
          >
            Go!
          </a>
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
