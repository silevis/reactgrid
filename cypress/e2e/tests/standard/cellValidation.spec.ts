import { config } from '../../../../src/test/testEnvConfig';
import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { visit } from '../../common/visit';

const utils = new Utilities(config);
const INVALID_CLASS_NAME = "rg-invalid";

context('Cell validation', () => {

    beforeEach(() => {
        visit();
    });

    it('should be valid text cell', () => { // ✅
        const cellIdx = 2;
        const cellIdy = 2;

        utils.selectCell(config.cellWidth * 2 + utils.getCellXCenter(), config.cellHeight * 4);
   
        utils.getCell(cellIdx, cellIdy).should('not.have.class', INVALID_CLASS_NAME);
    });

    it('should be valid email cell', () => { // ✅
        const cellIdx = 3;
        const cellIdy = 2;
        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), config.cellHeight * 4);

        utils.getCell(cellIdx, cellIdy).should('not.have.class', INVALID_CLASS_NAME);
    });

    it('should be valid number cell', () => { // ✅
        const cellIdx = 4;
        const cellIdy = 2;

        utils.selectCell(config.cellWidth * 2 + utils.getCellXCenter(), config.cellHeight * 4);
        
        utils.getCell(cellIdx, cellIdy).should('not.have.class', INVALID_CLASS_NAME);
    });

    it('should not display error when entering invalid text', () => { // ✅
        const cellIdx = 1;
        const cellIdy = 2;

        utils.selectCell(config.cellWidth * 1 + utils.getCellXCenter(), config.cellHeight * 3);
        
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));

        utils.keyDown(constants.keyCodes.Delete, { force: true }, 500, true);
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        cy.focused().type("myText", { force: true });
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);

        utils.getCell(cellIdx, cellIdy).should('have.class', INVALID_CLASS_NAME);
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));
    });

    it('should display error when entering invalid number', () => { // ✅
        const cellIdx = 3;
        const cellIdy = 1;
        const INVALID_NUMBER = "1000"; // validator fails for it
        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), config.cellHeight * 2);

        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));

        utils.keyDown(constants.keyCodes.Delete, { force: true }, 500, true);
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        cy.focused().type(INVALID_NUMBER, { force: true });
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        
        utils.getCell(cellIdx, cellIdy).should('have.class', INVALID_CLASS_NAME);
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.contain('ERR'));
    });

    it('should display error when entering invalid email', () => { // ✅
        const cellIdx = 2;
        const cellIdy = 1;

        utils.selectCell(config.cellWidth * 2 + utils.getCellXCenter(), config.cellHeight * 2);
        
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));

        utils.keyDown(constants.keyCodes.Delete, { force: true }, 500, true);
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        cy.focused().type("abc", { force: true });
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        
        utils.getCell(cellIdx, cellIdy).should('have.class', INVALID_CLASS_NAME);
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.contain('ERR'));
    });

    it('should display error when entering invalid text', () => { // ✅
        const cellIdx = 1;
        const cellIdy = 1;

        utils.selectCell(config.cellWidth * 1 + utils.getCellXCenter(), config.cellHeight * 2);
        
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));

        utils.keyDown(constants.keyCodes.Delete, { force: true }, 500, true);
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        cy.focused().type("myText", { force: true });
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        
        utils.getCell(cellIdx, cellIdy).should('have.class', INVALID_CLASS_NAME);
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.contain('ERR'));
    });

    it('should not display error when entering invalid number', () => { // ✅
        const cellIdx = 3;
        const cellIdy = 2; // this cell has validation without errorMessage
        const INVALID_NUMBER = "1000"; // validator fails for it
        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), config.cellHeight * 3);

        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));

        utils.keyDown(constants.keyCodes.Delete, { force: true }, 500, true);
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        cy.focused().type(INVALID_NUMBER, { force: true });
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        
        utils.getCell(cellIdx, cellIdy).should('have.class', INVALID_CLASS_NAME);
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));
    });

    it('should not display error when entering invalid email', () => { // ✅
        const cellIdx = 2;
        const cellIdy = 2;  // this cell has validation without errorMessage

        utils.selectCell(config.cellWidth * 2 + utils.getCellXCenter(), config.cellHeight * 3);
        
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));

        utils.keyDown(constants.keyCodes.Delete, { force: true }, 500, true);
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        cy.focused().type("abc", { force: true });
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        
        utils.getCell(cellIdx, cellIdy).should('have.class', INVALID_CLASS_NAME);
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));
    });

    it('should not display error when entering invalid text', () => { // ✅
        const cellIdx = 1;
        const cellIdy = 2;

        utils.selectCell(config.cellWidth * 1 + utils.getCellXCenter(), config.cellHeight * 3);
        
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));

        utils.keyDown(constants.keyCodes.Delete, { force: true }, 500, true);
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        cy.focused().type("myText", { force: true });
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);

        utils.getCell(cellIdx, cellIdy).should('have.class', INVALID_CLASS_NAME);
        utils.getCell(cellIdx, cellIdy).should($cell => expect($cell.eq(0)).to.not.contain('ERR'));
    });
});
