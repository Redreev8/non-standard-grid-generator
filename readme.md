# Non standard gri generator

## Props

```
columns: number,
rows: number,
numberItem: number,
exception: string[], fromat 'column-row',
skipRows: number[],
component: (i: number, column: number, row: number) => string,
cb: (postition: { res: result component, i: number, column: number, row: number }) => void
```