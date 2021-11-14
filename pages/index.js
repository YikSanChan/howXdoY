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
  const domainScope =
    sites.length === 1
      ? `site:${sites[0]}`
      : `(${sites.map((site) => `site:${site}`).join(" OR ")})`;
  return encodeURI(`https://google.com/search?q=${term} ${domainScope}`);
}

function allowSearch(term, sites) {
  return term && sites.length > 0;
}

// reference: https://react-select.com/home#custom-styles
// gray-300 eq rgb(209, 213, 219)
const styleConfig = {
  // TODO: when focused, the border color should be black
  // control: (styles, { isFocused }) => {
  //   return {
  //     ...styles,
  //     borderColor: isFocused ? "black" : "white",
  //   }
  // },
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

// TODO: understand and cleanup class names
// TODO: how to leave comments
// TODO: onFocus border color should be black
// TODO: 2 boxes border are not the same
export default function Home({ blogs }) {
  const defaultBlogs = blogs.slice(0, 2);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedBlogs, setSelectedBlogs] = React.useState(defaultBlogs);

  // autofocus input, see https://reactjs.org/docs/hooks-reference.html#useref
  const inputElement = React.useRef(null);
  React.useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen font-mono">
      <Head>
        <title>How X Do Y</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center flex-1 w-1/4">
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
          <div className="flex flex-row justify-between border-2 border-gray-300 rounded px-2 py-0.5 h-10">
            <input
              className="flex-1 outline-none"
              type="text"
              ref={inputElement}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (
                  e.key === "Enter" &&
                  allowSearch(searchTerm, selectedBlogs)
                ) {
                  window.open(
                    getGoogleSearchQuery(
                      searchTerm,
                      selectedBlogs.map((blog) => blog.value)
                    )
                  );
                }
              }}
            />
            <button>↵</button>
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
  return {
    props: {
      blogs: blogs,
    },
  };
}
