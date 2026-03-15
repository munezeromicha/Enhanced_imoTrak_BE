/**
 * Reusable Excel report styling utility.
 * Use this when exporting Excel reports to get consistent formatting:
 * - Merged title row with branding color
 * - Metadata row (export date)
 * - Optional filter row
 * - Styled header row (borders, background, spacing)
 * - Bordered data rows
 *
 * Example usage:
 *   const workbook = new ExcelJS.Workbook();
 *   const worksheet = workbook.addWorksheet('Users');
 *   applyStyledReport(worksheet, {
 *     title: 'User List',
 *     columnCount: 7,
 *     columns: [{ key: 'user', width: 25 }, ...],
 *     headerValues: ['User', 'Email', ...],
 *     data: users.map(u => ({ user: u.name, ... })),
 *     filterText: filters ? 'Filters: ...' : undefined,
 *   });
 */

import ExcelJS from 'exceljs';
import type { Workbook, Worksheet, Row, Cell } from 'exceljs';

export interface ExcelReportStyleOptions {
  /** Report title (e.g. "User List") */
  title: string;
  /** Number of columns (used to merge title row, e.g. 7 → "A1:G1") */
  columnCount: number;
  /** Export date line; set to false to skip, or string to override default */
  exportDate?: boolean | string;
  /** Optional filter line below export date (e.g. "Filters: Role: Admin") */
  filterText?: string;
  /** Column definitions (key + width) */
  columns: { key: string; width: number }[];
  /** Header row labels (same order as columns) */
  headerValues: string[];
  /** Data rows (objects with keys matching column keys) */
  data: Record<string, unknown>[];
  /**
   * Optional: style a specific cell (e.g. status colors).
   * Return { fill, font } to apply.
   */
  cellStyler?: (
    rowIndex: number,
    key: string,
    value: unknown
  ) => { fill?: { type: 'pattern'; pattern: 'solid'; fgColor: { argb: string } }; font?: { color?: { argb: string } } } | void;
}

const DEFAULT_TITLE_FILL = 'FF0A6CFF';
const DEFAULT_HEADER_FILL = 'FF4B5563';

/**
 * Applies a styled report layout to an Excel worksheet:
 * - Row 1: Merged title cell (blue background, white text, centered)
 * - Row 2: Export date (optional)
 * - Row 3: Filter text (optional)
 * - Next row: Header row (dark gray background, white text, bordered)
 * - Following rows: Data with borders; optional per-cell styling
 *
 * @param worksheet - The worksheet to style (can be newly created)
 * @param options - Report content and styling options
 * @returns The 1-based index of the header row (for reference)
 */
export function applyStyledReport(
  worksheet: Worksheet,
  options: ExcelReportStyleOptions
): number {
  const {
    title,
    columnCount,
    exportDate = true,
    filterText,
    columns,
    headerValues,
    data,
    cellStyler,
  } = options;

  const lastCol = columnLetter(columnCount);
  const titleRange = `A1:${lastCol}1`;

  // ---- Title row ----
  worksheet.mergeCells(titleRange);
  const titleCell = worksheet.getCell('A1');
  titleCell.value = title;
  titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: DEFAULT_TITLE_FILL },
  };
  worksheet.getRow(1).height = 30;

  let currentRow = 2;

  // ---- Metadata row (export date) ----
  if (exportDate !== false) {
    const dateText =
      typeof exportDate === 'string'
        ? exportDate
        : `Export Date: ${new Date().toLocaleString()}`;
    worksheet.getCell(`A${currentRow}`).value = dateText;
    worksheet.getCell(`A${currentRow}`).font = { italic: true, size: 10 };
    worksheet.getRow(currentRow).height = 20;
    currentRow++;
  }

  // ---- Filter row (optional) ----
  if (filterText) {
    worksheet.getCell(`A${currentRow}`).value = filterText;
    worksheet.getCell(`A${currentRow}`).font = {
      italic: true,
      size: 9,
      color: { argb: 'FF666666' },
    };
    worksheet.getRow(currentRow).height = 18;
    currentRow++;
  }

  // ---- Column definitions ----
  worksheet.columns = columns.map((col) => ({
    key: col.key,
    width: col.width,
  }));

  // ---- Header row ----
  const headerRow = worksheet.getRow(currentRow);
  headerRow.values = headerValues;
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: DEFAULT_HEADER_FILL },
  };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  headerRow.height = 25;
  const headerRowIndex = currentRow;
  currentRow++;

  // ---- Data rows ----
  data.forEach((rowData, index) => {
    const row = worksheet.addRow(rowData);
    if (cellStyler) {
      columns.forEach((col) => {
        const value = rowData[col.key];
        const style = cellStyler(headerRowIndex + index, col.key, value);
        if (style) {
          const cell = row.getCell(col.key);
          if (style.fill) cell.fill = style.fill;
          if (style.font) cell.font = { ...cell.font, ...style.font };
        }
      });
    }
  });

  // ---- Borders: from header row to last data row ----
  const dataStartRow = headerRowIndex;
  const dataEndRow = worksheet.rowCount;
  worksheet.eachRow((row: Row, rowNumber: number) => {
    if (rowNumber >= dataStartRow) {
      row.eachCell((cell: Cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }
  });

  return headerRowIndex;
}

/**
 * Returns Excel column letter(s) for a 1-based column index (e.g. 1 → 'A', 27 → 'AA').
 */
function columnLetter(n: number): string {
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/**
 * Create a new workbook with creator/metadata and optionally a single styled sheet.
 * Use this at the start of an export, then call applyStyledReport on the worksheet.
 */
export function createReportWorkbook(creatorName = 'IKIBINA'): Workbook {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = creatorName;
  workbook.created = new Date();
  return workbook;
}

/*
 * Usage example (e.g. in a UserExportService or VehicleExportService):
 *
 * import ExcelJS from 'exceljs';
 * import { createReportWorkbook, applyStyledReport } from '../utils/excelReportHelper';
 *
 * const workbook = createReportWorkbook('IKIBINA');
 * const worksheet = workbook.addWorksheet('Users');
 * applyStyledReport(worksheet, {
 *   title: 'User List',
 *   columnCount: 7,
 *   exportDate: true,
 *   filterText: filters ? `Filters: Role: ${filters.role} | ...` : undefined,
 *   columns: [
 *     { key: 'user', width: 25 },
 *     { key: 'email', width: 30 },
 *     { key: 'phoneNumber', width: 20 },
 *     { key: 'companies', width: 30 },
 *     { key: 'role', width: 20 },
 *     { key: 'status', width: 15 },
 *     { key: 'joinedAt', width: 20 },
 *   ],
 *   headerValues: ['User', 'Email', 'Phone', 'Companies', 'Role', 'Status', 'Joined'],
 *   data: users.map(u => ({
 *     user: `${u.firstName} ${u.lastName}`.trim(),
 *     email: u.email,
 *     phoneNumber: u.phoneNumber,
 *     companies: companyList,
 *     role: primaryRole,
 *     status: u.isActive ? 'Active' : 'Inactive',
 *     joinedAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
 *   })),
 *   cellStyler: (rowIndex, key, value) => {
 *     if (key !== 'status') return;
 *     const isActive = value === 'Active';
 *     return {
 *       fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: isActive ? 'FFD1FAE5' : 'FFFECACA' } },
 *       font: { color: { argb: isActive ? 'FF065F46' : 'FF991B1B' } },
 *     };
 *   },
 * });
 * // Then: return workbook or stream to response
 */
