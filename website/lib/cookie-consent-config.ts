import type { CookieConsentConfig } from "vanilla-cookieconsent";

const pluginConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: "box",
      position: "bottom right",
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      position: "left",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  onFirstConsent: function () {
    // console.log("onFirstAction fired");
  },

  onConsent: function ({ cookie }) {
    // console.log("onConsent fired ...");
  },

  onChange: function ({ changedCategories, cookie }) {
    // console.log("onChange fired ...");
  },

  categories: {
    necessary: {
      readOnly: true,
      enabled: true,
    },
    analytics: {
      enabled: true,
      autoClear: {
        cookies: [
          {
            name: /^(_ga|_gid)$/,
          },
        ],
      },
    },
  },

  language: {
    default: "en",

    translations: {
      en: {
        consentModal: {
          description:
            'Our website uses tracking cookies to understand how you interact with it. The tracking will be enabled only if you accept explicitly. <a href="#" data-cc="show-preferencesModal" class="cc__link">Manage preferences</a>',
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          showPreferencesBtn: "Manage preferences",
          closeIconLabel: "Close",
          footer: `
            <a href="${process.env.NEXT_PUBLIC_BASE_PATH}/privacy-policy">Privacy Policy</a>
          `,
        },
        preferencesModal: {
          title: "Cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Save preferences",
          closeIconLabel: "Close",
          sections: [
            {
              title: "Cookie Usage",
              description: `We're using cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="${process.env.NEXT_PUBLIC_BASE_PATH}/privacy-policy" class="cc__link">privacy policy</a>.`,
            },
            {
              title: "Strictly necessary cookies",
              description:
                "These cookies are essential for our website to work. They help you customize your experience and cannot be turned off.",
              linkedCategory: "necessary",
            },
            {
              title: "Performance and Analytics cookies",
              linkedCategory: "analytics",
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Service",
                  description: "Description",
                },
                body: [
                  {
                    name: "_ga",
                    domain: "Google Analytics",
                    description:
                      'Set by <a href="https://developers.google.com/analytics">Google Analytics</a> to distinguish users on a domain',
                  },
                  {
                    name: "_gid",
                    domain: "Google Analytics",
                    description:
                      'Set by <a href="https://developers.google.com/analytics">Google Analytics</a> to distinguish users',
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
};

export default pluginConfig;
