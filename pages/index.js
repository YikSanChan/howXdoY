import Head from "next/head";
import React from "react";

import Select from "react-select";
import fs from "fs";
import path from "path";

// read blog data from blogs.csv
function loadBlogs() {
  const filePath = path.join(process.cwd(), "public", "blogs.txt");
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
  const domainScope =
    sites.length === 1
      ? `site:${sites[0]}`
      : `(${sites.map((site) => `site:${site}`).join(" OR ")})`;
  return encodeURI(`https://google.com/search?q=${term} ${domainScope}`);
}

function shouldAllowSearch(term, sites) {
  return term && term.length > 2 && sites.length > 0;
}

// reference: https://react-select.com/home#custom-styles
// gray-300 eq rgb(209, 213, 219)
const styleConfig = {
  control: (styles) => ({
    ...styles,
    border: "2px solid rgb(209, 213, 219)",
    boxShadow: "none",
    ":hover": {
      border: "2px solid black",
    },
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? "rgb(209, 213, 219)" : "white",
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "white",
    border: "1px dotted black",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    ":hover": {
      backgroundColor: "black",
      color: "white",
    },
  }),
};

export default function Home({ blogs, defaultBlogs }) {
  // autofocus input, see https://reactjs.org/docs/hooks-reference.html#useref
  const inputElement = React.useRef(null);
  React.useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedBlogs, setSelectedBlogs] = React.useState(defaultBlogs);

  const allowSearch = shouldAllowSearch(searchTerm, selectedBlogs);
  const query = getGoogleSearchQuery(
    searchTerm,
    selectedBlogs.map((blog) => blog.value)
  );

  return (
    <div className="flex flex-col items-center min-h-screen font-mono">
      <Head>
        <title>How X Do Y</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center flex-1 w-1/3">
        <div className="w-full">
          <p className="my-3 text-3xl font-bold">How</p>
          <Select
            styles={styleConfig}
            defaultValue={defaultBlogs}
            isMulti
            name="blogs"
            options={blogs}
            classNamePrefix="select"
            onChange={(selected) => {
              setSelectedBlogs(selected);
            }}
          />
          <p className="my-3 text-3xl font-bold">Do</p>
          {/* https://tailwindui.com/components/application-ui/forms/input-groups */}
          <div className="relative rounded-md">
            <input
              type="text"
              className="block w-full rounded-md focus:border-black border-gray-300 border-2 focus:ring-0"
              ref={inputElement}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && allowSearch) {
                  window.open(query);
                }
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                className={`h-full px-1 text-gray-${
                  allowSearch ? "500" : "300"
                } rounded-md pointer-events-none`}
              >
                ↵ Enter
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p>Built by&nbsp;</p>
        <a
          className="flex items-center justify-center text-white bg-black"
          href="https://twitter.com/yiksanchan"
        >
          @yiksanchan
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const blogs = loadBlogs();
  const defaultBlogs = blogs.slice(0, 2);
  return {
    props: {
      blogs,
      defaultBlogs,
    },
  };
}
