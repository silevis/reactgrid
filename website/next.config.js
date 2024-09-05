/** @type {import('next').NextConfig} */

const withNextra = require("nextra")({
  distDir: "dist",
  theme: "nextra-theme-docs",
  themeConfig: "./nextra/theme.config.jsx",
});

module.exports = withNextra();
