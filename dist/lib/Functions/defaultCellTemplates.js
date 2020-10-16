import { ChevronCellTemplate, TimeCellTemplate, EmailCellTemplate, DateCellTemplate, CheckboxCellTemplate, HeaderCellTemplate, NumberCellTemplate, TextCellTemplate } from '../CellTemplates';
export var defaultCellTemplates = {
    text: new TextCellTemplate(),
    number: new NumberCellTemplate(),
    header: new HeaderCellTemplate(),
    checkbox: new CheckboxCellTemplate(),
    date: new DateCellTemplate(),
    email: new EmailCellTemplate(),
    time: new TimeCellTemplate(),
    chevron: new ChevronCellTemplate()
};
