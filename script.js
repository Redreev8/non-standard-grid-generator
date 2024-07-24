class nonStandardGridGenerator {
    _columns = 1
    _rows = 1
    postition = {}
    constructor({ 
        numberItem,
        exception,
        columns, 
        rows, 
        skipColumns,
        skipRows, 
        component,
        postition = {},
        cb
    }) {
        this.exception = exception ?? []
        this.numberItem = numberItem
        this.columns = columns ?? 1
        this.rows = rows ?? 1
        this.skipColumns = skipColumns ?? []
        this.skipRows = skipRows ?? []
        this.component = component ?? ((i, column, row) => `<li style="grid-column: ${column}/${column+1};grid-row: ${row}/${row+1};" class="item"><div class="content">item ${i}</div></li>`)
        this.postition = { ...this.postition, ...postition }
        this.cb = cb
        this.generate()
    }

    get columns() {
        return this._columns
    }

    set columns(value) {
        if (typeof value === 'function') return this._columns = value()
        this._columns = value
    }

    get rows() {
        return this._rows
    }

    set rows(value) {
        if (typeof value === 'function') return this._rows = value()

        this._rows = value
    }

    positionCalculation(i) {
        let column = Math.round(Math.random() * (this.columns - 1) + 1)  
        let row = Math.round(Math.random() * (this.rows - 1) + 1) 
        const p = `${column}-${row}`
        if (this.postition[p] || this.exception.includes(p) || this.skipColumns.includes(column) || this.skipRows.includes(row)) return this.positionCalculation(i)
        const res = this.component(i, column, row)
        this.postition[p] = { res, i, column, row }
    }

    generate() {
        for (let i = 0; i < this.numberItem; i++) {
            this.positionCalculation(i)        
        }
     
        this.cb && this.cb(this.postition)
    }
}

const numberItem = 6
const exception = ['4-1']
const columns = 4
const rowWidrth = 200
const rows = () => {
    const rows = Math.floor((document.body.clientHeight - 16) / rowWidrth)
    if (columns * rows >= numberItem + Math.round(columns / 2) + exception.length) return rows
    return Math.round(numberItem / columns) + Math.round(rows / 2)
}

new nonStandardGridGenerator({
    numberItem,
    exception,
    columns,
    skipRows: [1],
    rows,
    component: (i, column, row) => `
        .item:nth-child(${i + 1}n) {
            grid-column: ${column}/${column+1};
            grid-row: ${row}/${row+1};
        }
    `,
    cb: (postition) => {
        const head = document.head || document.getElementsByTagName('head')[0]
        const style = document.createElement('style')
        let css = ''
        for (const key in postition) {
            css += postition[key].res
        }

        head.appendChild(style)
        style.type = 'text/css'
        style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css))
    }
})