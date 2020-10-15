import { GridColumn, GridRow } from '../Model/InternalModel';
import { Location } from '../Model/InternalModel';

// just a helper, much quicker than newLocation()!
export const newLocation = (row: GridRow, column: GridColumn): Location => ({ row, column })