export const reorderArray = <T extends {}>(arr: T[], idxs: number[], to: number) => {
    const movedElements: T[] = arr.filter((_: T, idx: number) => idxs.includes(idx));
    to = Math.min(...idxs) < to ? to += 1 : to -= idxs.filter(idx => idx < to).length;
    const leftSide: T[] = arr.filter((_: T, idx: number) => idx < to && !idxs.includes(idx));
    const rightSide: T[] = arr.filter((_: T, idx: number) => idx >= to && !idxs.includes(idx));
    return [...leftSide, ...movedElements, ...rightSide];
}