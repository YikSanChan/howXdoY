import Head from "next/head";
import React from "react";

import Select from "react-select";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>How X Do Y</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-50 flex-1 px-20">
        <h1 className="text-6xl font-bold">
          Welcome to <a className="text-blue-600">How X Do Y</a>
        </h1>

        <div className="w-full">
          <p>How</p>
          <Select
            defaultValue={[
              { value: "ocean", label: "Ocean", color: "#00B8D9" },
            ]}
            isMulti
            name="colors"
            options={[
              { value: "ocean", label: "Ocean", color: "#00B8D9" },
              { value: "blue", label: "Blue", color: "#0052CC" },
              { value: "purple", label: "Purple", color: "#5243AA" },
            ]}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <p>Do</p>
          <div className="flex flex-col">
            <input
              className="border border-gray-300 rounded px-2 h-10"
              type="text"
            />
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by @yiksanchan
        </a>
      </footer>
    </div>
  );
}
