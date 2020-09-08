import { TextCellTemplate } from '../CellTemplates/TextCellTemplate';
import { NumberCellTemplate } from '../CellTemplates/NumberCellTemplate';
import { HeaderCellTemplate } from '../CellTemplates/HeaderCellTemplate';
import { CheckboxCellTemplate } from '../CellTemplates/CheckboxCellTemplate';
import { DateCellTemplate } from '../CellTemplates/DateCellTemplate';
import { EmailCellTemplate } from '../CellTemplates/EmailCellTemplate';
import { TimeCellTemplate } from '../CellTemplates/TimeCellTemplate';
import { ChevronCellTemplate } from '../CellTemplates/ChevronCellTemplate';
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
