"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import pluginConfig from "../lib/cookie-consent-config";

const CookieConsentComponent = () => {
  useEffect(() => {
    CookieConsent.run(pluginConfig);
  }, []);

  return null;
};

export default CookieConsentComponent;
