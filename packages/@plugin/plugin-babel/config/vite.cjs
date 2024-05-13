module.exports = {
  plugins: [
    {
      name: "legacy",
      params: {
        targets: [
          "> 1%",
          "not ie 11",
          "not op_mini all",
          "chrome >= 78",
          "edge >= 78",
          "firefox >= 72",
          "safari >= 13",
          "opera >= 67",
        ],
      },
      import: { name: "legacy", from: "@vitejs/plugin-legacy" },
    },
  ],
};
