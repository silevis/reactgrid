import {
    ChevronCellTemplate, TimeCellTemplate, EmailCellTemplate, DateCellTemplate, CheckboxCellTemplate,
    HeaderCellTemplate, NumberCellTemplate, TextCellTemplate
} from '../CellTemplates';
import { CellTemplates } from '../Model/PublicModel';

export const defaultCellTemplates: CellTemplates = {
    text: new TextCellTemplate(),
    number: new NumberCellTemplate(),
    header: new HeaderCellTemplate(),
    checkbox: new CheckboxCellTemplate(),
    date: new DateCellTemplate(),
    email: new EmailCellTemplate(),
    time: new TimeCellTemplate(),
    chevron: new ChevronCellTemplate()
};
