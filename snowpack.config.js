module.exports = {
  mount: {
    public: "/",
    src: "/dist",
  },
  plugins: [
    "@snowpack/plugin-typescript",
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-webpack",
    [
      "@snowpack/plugin-babel",
      {
        transformOptions: {
          presets: [
            "@babel/preset-typescript",
            "@babel/preset-react",
            "@babel/preset-env",
          ],
        },
      },
    ],
  ],
  buildOptions: {
    baseUrl: "/peerjs-react-conferencing-template",
    metaUrlPath: "snowpack",
  },
}
