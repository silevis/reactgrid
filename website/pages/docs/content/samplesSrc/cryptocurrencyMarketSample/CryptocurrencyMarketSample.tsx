import React, { useEffect, useRef, useState } from 'react';
import { ReactGrid, Column, Id, Row, DefaultCellTypes } from '@silevis/reactgrid';
import styled from 'styled-components';
import { CssClassCell, CssClassCellTemplate } from '../../cellTemplates/cssClassCellTemplate/CssClassTemplate';
import { columns } from '../../data/cryptocurrencyMarket/columns'
import './styling.scss';

const ReactGridContainer = styled.div`
  position: relative;
  min-height: 400px;
`

const fetchCryptocurrencyMarketData = async () => {
  const promise = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd");
  const currenciesAsJson = await promise.json();
  const newRows: Row<DefaultCellTypes | CssClassCell>[] = [
    {
      rowId: 'header',
      reorderable: false,
      height: 25,
      cells: [...columns.map((c: Column) => ({ type: 'header', text: c.columnId }))],
    },
    ...currenciesAsJson.map((item: { [key: string]: any }) => {
      return {
        rowId: item.id,
        reorderable: false,
        height: 25,
        cells: [
          { type: 'number', value: item.market_cap_rank },
          { type: 'text', text: item.name },
          { type: 'text', text: item.symbol },
          { type: 'cssClass', value: item.current_price },
          { type: 'number', value: item.low_24h },
          { type: 'number', value: item.high_24h },
          { type: 'number', value: item.total_volume },
        ]
      }
    }),
  ];
  return newRows;
}

interface CryptocurrencyMarketState {
  columns: Column[];
  rows: Row<DefaultCellTypes | CssClassCell>[];
}

export const CryptocurrencyMarketSample: React.FunctionComponent = () => {

  const [state, setState] = useState<CryptocurrencyMarketState>(() => ({
    columns: [...columns],
    rows: []
  }));

  const returnRandomWith = (numberOfRows: number) => Math.floor(Math.random() * numberOfRows + 1)

  const currentValueRandom = <T extends Row<DefaultCellTypes | CssClassCell>>(apiRows: T[], numberOfRows: number): number => {
    const row: Row<DefaultCellTypes | CssClassCell> | undefined = apiRows.find((_: T, idx: number) => idx === numberOfRows);
    if (!row) return 0;
    const min = (row.cells[4] as CssClassCell).value;
    const max = (row.cells[5] as CssClassCell).value;
    const randomValue = (Math.random() * (+max - +min) + +min);
    return parseFloat(randomValue.toFixed(6));
  }

  const findIdsChanged = <T extends Row<DefaultCellTypes | CssClassCell>>(itemID: Id, dataApi: T[]) => {
    let changedRowIds: number[] = [];
    dataApi.forEach((item, idx) => {
      if (item.rowId === itemID) {
        changedRowIds = [...changedRowIds, idx]
      }
    });
    return changedRowIds;
  }

  const findChangedRows = <T extends Row<DefaultCellTypes | CssClassCell>>(dataState: T[], dataApi: T[]): T[] => {
    if (!dataState) return [];
    return dataState.filter((data, idx) => idx !== 0 && (data.cells[3] as CssClassCell).value !== (dataApi[idx].cells[3] as CssClassCell).value);
  }

  const useInterval = (callback: any, delay: number) => {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      const tick = () => (savedCallback as any).current();
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(() => renderValue(), 3000);

  const renderValue = () => {
    fetchCryptocurrencyMarketData().then(res => {
      const dataApi = res;
      const dataState = [...state.rows];
      for (let i = 0; i < Math.floor(dataApi.length / 6); i++) {
        const changedIdx = returnRandomWith(dataApi.length);
        (dataApi[changedIdx].cells[3] as CssClassCell).value = currentValueRandom(dataApi, changedIdx);
      }

      const cheangeRows = findChangedRows(dataState, dataApi);
      if (cheangeRows.length !== 0) {
        cheangeRows.forEach(row => {
          let idsToChange: number[] = findIdsChanged(row.rowId, dataApi);
          idsToChange.forEach(id => {
            const valueFromApi = (dataApi[id].cells[3] as CssClassCell).value;
            const valueFromState = (dataState[id].cells[3] as CssClassCell).value;
            if (valueFromApi !== valueFromState) {
              (dataApi[id].cells[3] as CssClassCell).className = valueFromApi > valueFromState ? 'growth' : 'decrease';
            }
          })
          idsToChange.length = 0;
        })
      }
      setState({ columns: [...state.columns], rows: dataApi });
    })
      .catch(console.error);
  }

  return (
    <>
      <ReactGridContainer id="cryptocurrency-market-sample">
        {state.rows.length !== 0 ?
          <ReactGrid
            rows={state.rows}
            columns={state.columns}
            customCellTemplates={{
              'cssClass': new CssClassCellTemplate()
            }}
            stickyTopRows={1}
            enableFillHandle={false}
            enableRowSelection
            enableColumnSelection
            enableRangeSelection
          />
          : <span className='cryptocurrency-market-sample-loader'>Loading...</span>}
      </ReactGridContainer>
    </>
  )
}

