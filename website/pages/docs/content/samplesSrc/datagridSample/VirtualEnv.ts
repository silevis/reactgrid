import { Column, Highlight, } from '@silevis/reactgrid';
import { rows } from '../../data/crm/rows';
import { VirtualUser } from './VirtualUser';

export interface IDatagridState {
    columns: Column[],
    rows: ReturnType<typeof rows>,
    stickyTopRows?: number,
    stickyLeftColumns?: number,
    highlights: Highlight[]
}

export class VirtualEnv {

    private virtualUsers: VirtualUser[] = [];

    addUser(virtualUser: VirtualUser): VirtualEnv {
        this.virtualUsers = [...this.virtualUsers, virtualUser];
        return this;
    }

    updateView = (state: IDatagridState) => {
        let modifiedState = { ...state };
        this.virtualUsers.forEach(virtualUser => modifiedState = virtualUser.makeChanges(modifiedState));
        return modifiedState;
    }
}