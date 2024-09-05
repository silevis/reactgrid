import React, { useState, useEffect, useMemo } from "react";
import { WorkhoursGrid } from "./WorkhoursGrid";
import './styling.scss'
import { HuePicker, HSLColor } from 'react-color';

const fontSizes = ['xx-small', 'x-small', 'small', 'smaller', 'medium', 'large', 'larger', 'x-large', 'xx-large']

export const WorkhoursSample = () => {
    const [rowHeight, setRowHeight] = useState<number>(35);
    const [color, setColor] = useState<HSLColor>({ h: 209, s: 1, l: 0.5 });
    const [fontFamily, setFontFamily] = useState<string>('Helvetica');
    const [fontSizeIdx, setFontSizeIdx] = useState<number>(4);

    const hslColor = useMemo(() => `${Math.floor(color.h)},${Math.floor(color.s * 100)}%,${Math.floor(color.l * 100) + 25}%`, [color])

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary', hslColor);
        root.style.setProperty('--font', fontFamily);
    }, [hslColor, fontFamily])
    return (
        <>
            <div style={{ fontFamily, fontSize: fontSizes[fontSizeIdx], display: 'inline-block', maxHeight: '350px', overflow: 'scroll', maxWidth: '100%' }}>
                <WorkhoursGrid rowHeight={rowHeight} color={`hsla(${hslColor}, 0.75)`} />
            </div>
            <div className="row">
                <div className="ms-Grid-col" style={{ padding: ' 0 2em' }}>
                    <p>Row height: {rowHeight}px</p>
                    <input type='range' min={20} max={100} value={rowHeight} onChange={e => setRowHeight(parseInt(e.target.value))} />
                </div>
                <div className="ms-Grid-col" style={{ padding: ' 0 2em' }}>
                    <p>Color:</p>
                    <HuePicker color={color} onChange={e => setColor(e.hsl)} />
                </div>
                <div className="ms-Grid-col" style={{ padding: ' 0 2em' }}>
                    <p>Font size: {fontSizes[fontSizeIdx]}</p>
                    <input type='range' min={0} max={8} value={fontSizeIdx} onChange={e => setFontSizeIdx(parseInt(e.target.value))} />
                </div>
                <div className="ms-Grid-col" style={{ padding: ' 0 2em' }}>
                    <p>Font: </p>
                    <select
                        value={fontFamily}
                        onChange={e => setFontFamily(e.target.value)}
                    >
                        {['Helvetica', 'Trebuchet MS', 'Comic Sans MS', 'Courier New', 'Lucida Console'].map((value, idx) => <option key={idx} value={value}>{value}</option>)}
                    </select>
                </div>
            </div>
        </>
    );
}