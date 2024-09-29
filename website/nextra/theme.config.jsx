const config = {
  useNextSeoProps() {
    return {
      titleTemplate: "%s – React Grid Docs",
    };
  },
  logo: (
    <>
      <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_401_14556)">
        <path d="M4.5 4.5H0V6H4.5V4.5Z" fill="#107C41"/>
        <path d="M21 4.5H10.5V6H21V4.5Z" fill="#107C41"/>
        <path d="M10.5 4.5H6V6H10.5V4.5Z" fill="#107C41"/>
        <path d="M18.75 0H2.25V1.5H18.75V0Z" fill="#107C41"/>
        <path d="M10.5 12H6V13.5H10.5V12Z" fill="#107C41"/>
        <path d="M6 19.5H2.25V21H6V19.5Z" fill="#107C41"/>
        <path d="M1.5 18.75L1.5 2.25L4.76837e-07 2.25L4.76837e-07 18.75H1.5Z" fill="#107C41"/>
        <path d="M6.00336 21L6.00336 4.5H4.50369L4.50369 21H6.00336Z" fill="#107C41"/>
        <path d="M20.7782 22.7187L10.2801 12.2183L9.21968 13.2789L19.7178 23.7793L20.7782 22.7187Z" fill="#107C41"/>
        <path d="M6.00336 4.5L6.00336 0L4.50369 0L4.50369 4.5H6.00336Z" fill="#107C41"/>
        <path d="M21 2.25H19.5C19.5 1.8375 19.1625 1.5 18.75 1.5V0C19.9969 0 21 1.0125 21 2.25Z" fill="#107C41"/>
        <path d="M1.5 2.25H0C0 1.0125 1.0125 0 2.25 0V1.5C1.8375 1.5 1.5 1.8375 1.5 2.25Z" fill="#107C41"/>
        <path d="M2.25 21C1.0125 21 0 19.9875 0 18.75H1.5C1.5 19.1625 1.8375 19.5 2.25 19.5V21Z" fill="#107C41"/>
        <path d="M5.99866 12H0V13.5H5.99866V12Z" fill="#107C41"/>
        <path d="M21 12H15V13.5H21V12Z" fill="#107C41"/>
        <path d="M21 13.5L21 2.25L19.5003 2.25L19.5003 13.5H21Z" fill="#107C41"/>
        <path d="M10.5 13.5V12C12.15 12 13.5 10.65 13.5 9C13.5 7.35 12.15 6 10.5 6V4.5C12.9844 4.5 15 6.51563 15 9C15 11.4844 12.9844 13.5 10.5 13.5Z" fill="#107C41"/>
        <path d="M15 24C11.6906 24 9 21.3094 9 18C9 14.6906 11.6906 12 15 12V13.5C12.5156 13.5 10.5 15.5156 10.5 18C10.5 20.4844 12.5156 22.5 15 22.5V24Z" fill="#107C41"/>
        <path d="M21 22.5H16.5V24H21V22.5Z" fill="#107C41"/>
        <path d="M21 24V19.5H19.5003V24H21Z" fill="#107C41"/>
        </g>
        <defs>
        <clipPath id="clip0_401_14556">
        <rect width="21" height="24" fill="white"/>
        </clipPath>
        </defs>
      </svg>
    </>
  ),
  project: {
    link: "https://github.com/silevis/reactgrid",
  },
  primaryHue: { dark: 147, light: 147 },
  primarySaturation: { dark: 27, light: 27 },
  footer: {
    component: null,
  },
  editLink: {
    component: null,
  },
  docsRepositoryBase:
    "https://github.com/silevis/reactgrid-website/tree/gh-pages-dev",
  sidebar: {
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  banner: {
    key: '5.0-release',
    text: (
      <a href="/docs/5.0/1-getting-started" target="_blank">
        🎉 ReactGrid 5.0 is released. Read more →
      </a>
    )
  }
};

export default config;