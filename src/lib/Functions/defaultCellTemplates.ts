import { TextCellTemplate } from '../CellTemplates/TextCellTemplate';
import { NumberCellTemplate } from '../CellTemplates/NumberCellTemplate';
import { HeaderCellTemplate } from '../CellTemplates/HeaderCellTemplate';
import { CheckboxCellTemplate } from '../CellTemplates/CheckboxCellTemplate';
import { DateCellTemplate } from '../CellTemplates/DateCellTemplate';
import { EmailCellTemplate } from '../CellTemplates/EmailCellTemplate';
import { TimeCellTemplate } from '../CellTemplates/TimeCellTemplate';
import { GroupCellTemplate } from '../CellTemplates/GroupCellTemplate';
import { CellTemplates } from '../Model/PublicModel';

export const defaultCellTemplates: CellTemplates = {
    text: new TextCellTemplate(),
    number: new NumberCellTemplate(),
    header: new HeaderCellTemplate(),
    checkbox: new CheckboxCellTemplate(),
    date: new DateCellTemplate(),
    email: new EmailCellTemplate(),
    time: new TimeCellTemplate(),
    group: new GroupCellTemplate()
};
