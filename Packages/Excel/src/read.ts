import ExcelJS from 'exceljs'
import { IExcelColumn } from './typing'

export async function readExcel(file: File, columns: IExcelColumn[], sheet = 0) {
  const workbook = new ExcelJS.Workbook()
  const buffer = await file.arrayBuffer()
  await workbook.xlsx.load(buffer)
  const workSheet = workbook.worksheets[sheet]
  const dataTable: Array<Record<string, string | number | object>> = []
  // * all value of first column are null
  // https://github.com/exceljs/exceljs/issues/698
  workSheet.eachRow((row, rowNumber) => {
    if (row === undefined || row === null) {
      return
    }
    let newObj: Record<
      string,
      | ExcelJS.CellValue
      | {
          error: ExcelJS.CellErrorValue
        }
    > | null = null
    const rowValues = row.values as ExcelJS.CellValue[]
    columns.forEach((column) => {
      if (rowNumber === 1) {
        // header
        const index = rowValues.findIndex(
          (cellVal) => cellVal && (cellVal as string).includes(column.dataIndex),
        )
        if (index >= 0) {
          column.index = index
        }
      } else {
        if (column.index && column.index >= 0) {
          //  check rowValues is formula
          const cellValue =
            (rowValues[column.index] &&
              (rowValues[column.index] as ExcelJS.CellFormulaValue).result) ??
            rowValues[column.index]

          if (newObj === null) {
            newObj = { [column.dataIndex]: cellValue }
          } else {
            newObj[column.dataIndex] = cellValue
          }
        }
      }
    })
    if (newObj !== null) {
      dataTable.push(newObj)
    }
  })
  return dataTable
}
