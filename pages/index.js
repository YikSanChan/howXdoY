import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import Select from "react-select";
import fs from "fs";
import path from "path";

const QUERY = "q";
const ORGS = "orgs";

// read blog data from blogs.csv
function loadBlogs() {
  const filePath = path.join(process.cwd(), "public", "blogs.txt");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return Object.fromEntries(fileContents.split("\n").map((s) => s.split(",")));
}

function getGoogleSearchQuery(term, sites) {
  const domainScope = sites.map((site) => `site:${site}`).join(" OR ");
  return encodeURI(`https://google.com/search?q=${term} ${domainScope}`);
}

function shouldAllowSearch(term) {
  return term && term.length > 2;
}

// reference: https://react-select.com/home#custom-styles
// gray-300 eq rgb(209, 213, 219)
const styleConfig = {
  control: (styles) => ({
    ...styles,
    border: "2px solid rgb(209, 213, 219)",
    borderRadius: "6px",
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

function useQueryParams() {
  const router = useRouter();
  return [
    router.query,
    function (params) {
      const url =
        "?" +
        Object.keys(params)
          .map(
            (key) =>
              encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
          )
          .join("&");
      router.push(url);
    },
  ];
}

export default function Home({ blogs }) {
  // autofocus input, see https://reactjs.org/docs/hooks-reference.html#useref
  const inputElement = React.useRef(null);
  React.useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  const [queryParams, setQueryParams] = useQueryParams();
  const searchTerm = queryParams[QUERY] || "";
  const selectedBlogs = queryParams[ORGS]
    ? queryParams[ORGS].toLowerCase()
        .split(",")
        .filter((name) => blogs.map((b) => b.label).includes(name))
        .map((name) => blogs.find((b) => b.label === name))
    : [];

  const allowSearch = shouldAllowSearch(searchTerm);
  const query = getGoogleSearchQuery(
    searchTerm,
    // nothing selected === all selected
    (selectedBlogs.length === 0 ? blogs : selectedBlogs).map((b) => b.value.url)
  );

  return (
    <div className="flex flex-col items-center min-h-screen font-mono">
      <Head>
        <title>How X Do Y</title>
        <link rel="icon" href="/favicon.ico" />
        <script async src="https://cdn.splitbee.io/sb.js"></script>
      </Head>

      <main className="flex items-center flex-1 w-1/3">
        <div className="w-full">
          <p className="my-3 text-3xl font-bold">How</p>
          <Select
            placeholder={"Select to scope..."}
            styles={styleConfig}
            value={selectedBlogs}
            isMulti
            name="blogs"
            options={blogs}
            getOptionLabel={(option) => option.value.display_name}
            classNamePrefix="select"
            onChange={(selected) => {
              if (selected.length === 0) {
                const q = queryParams[QUERY];
                setQueryParams({ [QUERY]: q });
              } else {
                setQueryParams({
                  ...queryParams,
                  [ORGS]: selected.map((b) => b.label).join(","),
                });
              }
            }}
          />
          <p className="my-3 text-3xl font-bold">Do</p>
          {/* https://tailwindui.com/components/application-ui/forms/input-groups */}
          <div className="relative rounded-md">
            <input
              type="text"
              placeholder={'Try "recsys" or "build system"'}
              className="block w-full rounded-md focus:border-black border-gray-300 border-2 focus:ring-0"
              ref={inputElement}
              value={searchTerm}
              onChange={(e) => {
                setQueryParams({ ...queryParams, [QUERY]: e.target.value });
              }}
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
        <p>By&nbsp;</p>
        <a
          className="text-white bg-black"
          href="https://twitter.com/yiksanchan"
        >
          @yiksanchan
        </a>
        <p>&nbsp;·&nbsp;</p>
        <a
          className="text-white bg-black"
          href="https://github.com/YikSanChan/howXdoY"
        >
          Source
        </a>
      </footer>
    </div>
  );
}

function lowerTrim(s) {
  return s.replace(/\s+/g, "").toLowerCase();
}

export async function getStaticProps() {
  const data = loadBlogs();
  const blogs = Object.entries(data).map((a) => {
    return { label: lowerTrim(a[0]), value: { display_name: a[0], url: a[1] } };
  });
  return {
    props: {
      blogs,
    },
  };
}
