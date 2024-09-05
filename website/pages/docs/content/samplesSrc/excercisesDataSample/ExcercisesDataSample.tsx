import React, { useState } from 'react';
import { ReactGrid, Column, CellChange, NumberCell, DefaultCellTypes, ChevronCell } from '@silevis/reactgrid';
import { Athlete, Excercise, Result } from './model';
import { DisabledCell, DisabledCellTemplate } from '../../cellTemplates/disabledCellTemplate/DisabledCellTemplate';
import { initialAthletes, initialExcercises, initialResults, parameters } from '../../data/excercisesData/initialValues';
import { getAthletesRow } from './getAthletesRow';
import { getExcerciseRows } from './getExcerciseRows';
import { addColorToEvenColumns } from './utils';
import './styling.scss';

export type SampleCellTypes = DefaultCellTypes | DisabledCell;

export const ExcercisesDataSample: React.FC = () => {
    const [athletes] = useState<Athlete[]>(initialAthletes);
    const [excercises, setExcercises] = useState<Excercise[]>(initialExcercises);
    const [results, setResults] = useState<Result[]>(initialResults);

    const columns: Column[] = [
        { columnId: 'excercise', width: 290 },
        ...athletes.map(athlete => ({ columnId: athlete.id, width: 150 }))
    ]

    const athletesRow = getAthletesRow(athletes);

    const rows = excercises.flatMap(excercise =>
        getExcerciseRows(
            excercise,
            athletes,
            results.filter(result => result.excerciseId === excercise.id)
        )
    );

    const cellChangesHandler = (changes: CellChange[]) => {
        changes.forEach(change => {
            if (change.columnId === 'excercise') {
                setExcercises(excercises =>
                    excercises.map(excercise => excercise.id === change.rowId
                        ? { ...excercise, hidden: !(change.newCell as ChevronCell).isExpanded }
                        : excercise
                    )
                )
                return
            }
            const param = parameters.find(param => param.id === change.rowId);
            if (!param) return
            const athleteId = change.columnId.toString();
            setResults(oldResults => {
                const resultIdx = oldResults.findIndex(oldResult =>
                    oldResult.parameterId === param.id && oldResult.athleteId === athleteId
                );
                const value = (change.newCell as NumberCell).value;
                if (resultIdx > -1) {
                    oldResults[resultIdx] = { ...oldResults[resultIdx], value };
                    return [...oldResults]
                }
                return [...oldResults, { athleteId, excerciseId: param.excerciseId, parameterId: param.id, value }]
            })
        })
    }

    return <div className="excercises-data-sample">
        <ReactGrid
            customCellTemplates={{
                'disabled': DisabledCellTemplate,
            }}
            columns={columns}
            stickyTopRows={1}
            stickyLeftColumns={1}
            onCellsChanged={cellChangesHandler}
            rows={[athletesRow, ...rows].map(addColorToEvenColumns)}
            enableRangeSelection
        />
    </div>
}

