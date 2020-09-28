import { CellStyle } from "../Model/PublicModel";
export declare const noBorder: ({ border, ...rest }: CellStyle) => Omit<CellStyle, 'border'>;
