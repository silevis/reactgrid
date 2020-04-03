import { GridColumn, GridRow, Location } from '../Model';

// just a helper, much quicker than newLocation()!
export const newLocation = (row: GridRow, column: GridColumn): Location => ({ row, column })