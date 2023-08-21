/// <reference types="Cypress" />

import { visitColumnAndRowSelections } from "../../common/visit";
import { constants } from "../../common/constants";
import { config } from "../../../../src/test/testEnvConfig";
import { Utilities } from "../../common/utils";

const utils = new Utilities(config);

context("Scroll", () => {
  beforeEach(() => {
    visitColumnAndRowSelections();
  });

  it.skip("should keep position while selecting column with touch", () => {
    // 🟠 TODO
  });

  it.skip("should keep position while selecting row with touch", () => {
    // 🟠 TODO
  });

  it.skip("should keep position while resizing column with touch", () => {
    // 🟠 TODO
  });
});
