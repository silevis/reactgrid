/// <reference types="Cypress" />

import { visitColumnAndRowSelections } from '../../common/visit';
import { Utilities } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Context menu', () => {
  beforeEach(() => {
    visitColumnAndRowSelections();
  });

  it('Open context menu', () => {  // ✅
    const menuPosX = utils.getCellXCenter();
    const menuPosY = utils.getCellYCenter();
    utils.openContextMenu(menuPosX, menuPosY);
    utils.getContextMenu().should('be.visible');
  });

  it('Open context menu with ctrl + mouse left button in MacOS', () => {  // ✅
    if (utils.isMacOs()) {
      const menuPosX = utils.getCellXCenter() + config.cellWidth;
      const menuPosY = utils.getCellYCenter() + config.cellHeight;
      utils.getReactGridContent().trigger('pointerdown', menuPosX, menuPosY, { ctrlKey: true, pointerType: 'cypress', force: true });
      utils.getReactGridContent().trigger('contextmenu', { clientX: menuPosX, clientY: menuPosY, force: true });
      utils.getReactGridContent().trigger('pointerup', menuPosX, menuPosY, { ctrlKey: true, pointerType: 'cypress', force: true });
      utils.getContextMenu().should('be.visible');
    }
  });

  it('should contain additional option on column selection', () => {  // ✅
    const menuPosX = utils.getCellXCenter();
    const menuPosY = utils.getCellYCenter();

    utils.selectCell(menuPosX, menuPosY);
    utils.openContextMenu(menuPosX, menuPosY);
    utils.getContextMenu().should('be.visible');
    utils.getContextMenuOption().should(($menuOption) => expect($menuOption)
      .to.contain('Custom menu column option'));
  });

  it('should contain additional option on row selection', () => {  // ✅
    const menuPosX = utils.getCellXCenter();
    const menuPosY = utils.getCellYCenter() + config.cellHeight;

    utils.selectCell(menuPosX, menuPosY);
    utils.openContextMenu(menuPosX, menuPosY);
    utils.getContextMenu().should('be.visible');
    utils.getContextMenuOption().should(($menuOption) =>
      expect($menuOption).to.contain('Custom menu row option'));
  });

});
