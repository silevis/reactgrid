import { CellStyle } from "../Model";

export const noBorder = ({ border, ...rest }: CellStyle): Omit<CellStyle, 'border'> => rest;