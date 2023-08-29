import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { disabledInitialFocusLocationConfig as config } from '../../../../src/test/testEnvConfig';
import { visitHeaders } from '../../common/visit';

const utils = new Utilities(config);

context('Focus', () => {

    beforeEach(() => {
        visitHeaders();
    });

    it('should reach first top focusable cell on page up key', () => { // ✅
        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), config.cellHeight * 5 + utils.getCellYCenter());
        utils.keyDown(constants.keyCodes.PageDown, { force: true });
        utils.keyDown(constants.keyCodes.PageDown, { force: true });
        utils.keyDown(constants.keyCodes.PageUp, { force: true });
        utils.keyDown(constants.keyCodes.PageUp, { force: true });
        utils.keyDown(constants.keyCodes.PageUp, { force: true });
        utils.wait();
        utils.assertElementTopIsEqual(utils.getCellFocus(), config.cellHeight - config.lineWidth);
    });

    it('should reach first left focusable cell on home key', () => { // ✅
        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), config.cellHeight * 5 + utils.getCellYCenter());
        utils.keyDown(constants.keyCodes.End, { force: true });
        utils.keyDown(constants.keyCodes.Home, { force: true });

        utils.assertElementLeftIsEqual(utils.getCellFocus(), config.cellWidth - config.lineWidth);
    });

    it('should reach first left focusable cell on end key', () => { // ✅
        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), config.cellHeight * 5 + utils.getCellYCenter());
        utils.keyDown(constants.keyCodes.Home, { force: true });
        utils.keyDown(constants.keyCodes.End, { force: true });

        utils.assertElementLeftIsEqual(utils.getCellFocus(), ((config.columns - 2) * config.cellWidth) - config.lineWidth);
    });

    it('should move focus right when header is in the middle', () => { // ✅
        const initFocusLeft = config.cellWidth * 9;
        const endFocusLeft = config.cellWidth * 13;

        utils.scrollTo(config.cellWidth * 7, 0);

        utils.selectCell(config.cellWidth * 2 + utils.getCellXCenter(), config.cellHeight * 4 + utils.getCellYCenter());
        utils.getCellFocus().then($focus => {
            expect(utils.round($focus.position().left)).to.be.equal(initFocusLeft - 1);
        });
        cy.wait(200);
        utils.keyDown(constants.keyCodes.ArrowRight, { force: true });
        utils.getCellFocus().then($focus => {
            expect(utils.round($focus.position().left)).to.be.equal(endFocusLeft - 1);
        });
    });

    it('should move focus left when header is in the middle', () => { // ✅
        const initFocusLeft = config.cellWidth * 13;
        const endFocusLeft = config.cellWidth * 9;

        utils.scrollTo(config.cellWidth * 7, 0);

        utils.selectCell(config.cellWidth * 6 + utils.getCellXCenter(), config.cellHeight * 4 + utils.getCellYCenter());
        utils.getCellFocus().then($focus => {
            expect(utils.round($focus.position().left)).to.be.equal(initFocusLeft - 1);
        });
        cy.wait(200);
        utils.keyDown(constants.keyCodes.ArrowLeft, { force: true });
        utils.getCellFocus().then($focus => {
            expect(utils.round($focus.position().left)).to.be.equal(endFocusLeft - 1);
        });
    });

    it('should move focus down when header is in the middle', () => { // ✅
        const initFocusTop = config.cellHeight * 2;
        const endFocusTop = config.cellHeight * 6;

        utils.scrollTo(config.cellWidth * 7, 0);

        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), initFocusTop + utils.getCellYCenter());
        utils.getCellFocus().then($focus => {
            expect(utils.round($focus.position().top)).to.be.equal(initFocusTop - 1);
        });
        cy.wait(200);
        utils.keyDown(constants.keyCodes.ArrowDown, { force: true });
        utils.getCellFocus().then($focus => {
            expect(utils.round($focus.position().top)).to.be.equal(endFocusTop - 1);
        });
    });

    it('should move focus up when header is in the middle', () => { // ✅
        const initFocusTop = config.cellHeight * 6;
        const endFocusTop = config.cellHeight * 2;

        utils.scrollTo(config.cellWidth * 7, 0);

        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), initFocusTop + utils.getCellYCenter());
        utils.getCellFocus().then($focus => {
            expect(utils.round($focus.position().top)).to.be.equal(initFocusTop - 1);
        });
        cy.wait(200);
        utils.keyDown(constants.keyCodes.ArrowUp, { force: true });
        utils.getCellFocus().then($focus => {
            expect(utils.round($focus.position().top)).to.be.equal(endFocusTop - 1);
        });
    });

    // 🟠  TODO: Doesn't currently work with headers. Isn't so trivial to fix.
    it.skip('should reach first left focusable cell on ctrl + home key', () => { 
        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), config.cellHeight * 5 + utils.getCellYCenter());
        utils.keyDown(constants.keyCodes.Home, { force: true, metaKey: true, ctrlKey: !utils.isMacOs() && true });

        utils.assertElementLeftIsEqual(utils.getCellFocus(), config.cellWidth - config.lineWidth);

    });

    // 🟠 TODO: Same as above
    it.skip('should reach first left focusable cell on ctrl + end key', () => { // ✅
        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), config.cellHeight * 5 + utils.getCellYCenter());
        utils.keyDown(constants.keyCodes.End, { force: true, metaKey: true, ctrlKey: !utils.isMacOs() && true });

        utils.assertElementLeftIsEqual(utils.getCellFocus(), ((config.columns - 2) * config.cellWidth) - config.lineWidth);

    });

});
