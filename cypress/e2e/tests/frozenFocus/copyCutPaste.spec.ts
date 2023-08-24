import { visit, visitFrozenFocus } from "../../common/visit";
import { Utilities } from "../../common/utils";
import { config } from "../../../../src/test/testEnvConfig";

const utils = new Utilities(config);

context("Copy / Cut / Paste", () => {
  beforeEach(() => {
    visitFrozenFocus();
    // visit();
  });

  // It seems that Cypress doesn't support clipboard events yet
  // See more: https://github.com/cypress-io/cypress/issues/2386
  it.skip("copy and paste into the same frozen focus", () => {
    const CELL_1_3 = {
      type: "text",
      groupId: "B",
      text: "3 - 1",
      style: {
        border: {
          left: { color: "red", style: "dashed", width: "2px" },
          top: { color: "red", style: "dashed", width: "2px" },
          right: { color: "red", style: "dashed", width: "2px" },
          bottom: { color: "red", style: "dashed", width: "2px" },
        },
      },
      value: 3,
      placeholder: "",
    };
    const CELL_1_3_PLAINTEXT = "3 - 1";
    const CELL_1_3_HTML = `
        <meta charset="utf-8" />
        <table
        empty-cells="show"
        data-reactgrid="reactgrid-content"
        style="
            color: rgb(255, 215, 0);
            font-family: sans-serif;
            font-size: medium;
            font-style: normal;
            font-variant-ligatures: normal;
            font-variant-caps: normal;
            font-weight: 400;
            letter-spacing: normal;
            orphans: 2;
            text-align: start;
            text-transform: none;
            widows: 2;
            word-spacing: 0px;
            -webkit-text-stroke-width: 0px;
            white-space: normal;
            background-color: rgb(0, 0, 0);
            text-decoration-thickness: initial;
            text-decoration-style: initial;
            text-decoration-color: initial;
        "
        >
        <tbody>
            <tr>
            <td
                data-reactgrid="${JSON.stringify(CELL_1_3)}"
                style="border: 1px solid rgb(211, 211, 211)"
            >
                3 - 1
            </td>
            </tr>
        </tbody>
        </table>
    `;

    const dataTransfer = new DataTransfer();

    utils.getScrollableElement().should("be.visible");
    utils.getCellFocus().should("be.visible");

    // * Might be needed to intercept event and update clipboard data
    // utils.getReactGrid().then(($rg) => {
    //   console.log("rg", $rg[0]);

    //   $rg[0].addEventListener("copy", (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     console.log('copy event', e);

    //     if (e.clipboardData) {
    //         e.clipboardData.setData('text/plain', CELL_1_3_PLAINTEXT);
    //         e.clipboardData.setData('text/html', CELL_1_3_HTML);
    //     }
    //   });
    // });

    // ! This errors with "DOMException: Must be handling a user gesture to use custom clipboard"
    cy.focused().trigger("copy", {
      eventConstructor: "ClipboardEvent",
      isTrusted: true,
      force: true,
    });
    
    // ! Those two don't work either - they don't trigger the copy event
    // cy.focused().type('{ctrl}c');
    // cy.focused().trigger('keydown', { key: 'c', ctrlKey: !utils.isMacOs(), metaKey: utils.isMacOs() });

    // ? Where should this be updated?
    // dataTransfer.setData('text/plain', CELL_1_3_PLAINTEXT);
    // dataTransfer.setData('text/html', CELL_1_3_HTML);

    // Try to select cell [1, 6] and paste data
    utils.selectCell(
      config.cellWidth + utils.getCellXCenter(),
      config.cellHeight * 5 + utils.getCellYCenter()
    );

    // cy.focused().trigger('paste',  { clipboardData: dataTransfer });

    // Make sure focus is still on the same cell and data in cell [1, 6] hasn't changed
    utils.assertElementTopIsEqual(
      utils.getCellFocus(),
      config.cellHeight * 3 - 1
    );
    utils.getCell(1, 3).should("contain.text", "3 - 1");
    utils.getCell(1, 6).should("contain.text", "6 - 1");
  });
});
