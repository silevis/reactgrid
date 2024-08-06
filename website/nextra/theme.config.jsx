const config = {
  useNextSeoProps() {
    return {
      titleTemplate: "%s – React Grid Docs",
    };
  },
  logo: false,
  project: {
    link: "https://github.com/silevis/reactgrid",
  },
  primaryHue: { dark: 147, light: 147 },
  primarySaturation: { dark: 27, light: 27 },
  footer: {
    component: false,
  },
  editLink: {
    component: false,
  },
  docsRepositoryBase:
    "https://github.com/silevis/reactgrid-website/tree/gh-pages-dev",
  sidebar: {
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
};

export default config;
