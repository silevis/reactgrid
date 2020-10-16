import { CellStyle } from "../Model/PublicModel";

export const noBorder = ({ border, ...rest }: CellStyle): Omit<CellStyle, 'border'> => rest;
