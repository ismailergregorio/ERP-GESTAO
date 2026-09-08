import React from "react";
import "./Table.css";

export interface TableColumn<T extends object> {
  key: keyof T | string;
  label: string;

  render?: (value: unknown, row: T) => React.ReactNode;

  width?: string;

  align?: "left" | "center" | "right";
}

export interface TableAction<T extends object> {
  label: string;

  variant?: "primary" | "secondary" | "danger" | "success";

  onClick: (row: T) => void;

  disabled?: (row: T) => boolean;
}

interface TableProps<T extends object> {
  columns: TableColumn<T>[];

  data: T[];

  actions?: TableAction<T>[];

  loading?: boolean;

  emptyMessage?: string;

  selectable?: boolean;

  selectedRows?: T[];

  onSelectionChange?: (rows: T[]) => void;

  rowKey?: keyof T;

  page?: number;

  totalPages?: number;

  onPageChange?: (page: number) => void;

  itemsPerPage?: number;

  totalItems?: number;
}

export default function Table<T extends object>({
  columns,
  data,
  actions = [],

  loading = false,

  emptyMessage = "Nenhum registro encontrado.",

  selectable = false,

  selectedRows = [],

  onSelectionChange,

  rowKey,

  page = 1,

  totalPages = 1,

  onPageChange,

  itemsPerPage = 10,

  totalItems,
}: TableProps<T>) {
  /*
   * =====================================================
   * SELEÇÃO
   * =====================================================
   */

  const getRowKey = (row: T, index: number) => {
    if (rowKey) {
      return String(row[rowKey]);
    }

    return String(index);
  };

  const isSelected = (row: T) => {
    if (!rowKey) {
      return selectedRows.includes(row);
    }

    return selectedRows.some(
      (selected) => String(selected[rowKey]) === String(row[rowKey]),
    );
  };

  const handleSelectRow = (row: T) => {
    if (!onSelectionChange) {
      return;
    }

    const exists = isSelected(row);

    if (exists) {
      onSelectionChange(
        selectedRows.filter((selected) =>
          rowKey
            ? String(selected[rowKey]) !== String(row[rowKey])
            : selected !== row,
        ),
      );
    } else {
      onSelectionChange([...selectedRows, row]);
    }
  };

  const allSelected = data.length > 0 && data.every((row) => isSelected(row));

  const handleSelectAll = () => {
    if (!onSelectionChange) {
      return;
    }

    if (allSelected) {
      const currentKeys = new Set(
        data.map((row) => (rowKey ? String(row[rowKey]) : row)),
      );

      onSelectionChange(
        selectedRows.filter(
          (row) => !currentKeys.has(rowKey ? String(row[rowKey]) : row),
        ),
      );
    } else {
      const newRows = data.filter((row) => !isSelected(row));

      onSelectionChange([...selectedRows, ...newRows]);
    }
  };

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (loading) {
    return (
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              {selectable && (
                <th className="checkbox-column">
                  <div className="skeleton skeleton-checkbox" />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{
                    width: column.width,
                    textAlign: column.align || "left",
                  }}
                >
                  {column.label}
                </th>
              ))}

              {actions.length > 0 && <th className="actions-column">Ações</th>}
            </tr>
          </thead>

          <tbody>
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <tr key={index}>
                {selectable && (
                  <td>
                    <div className="skeleton skeleton-checkbox" />
                  </td>
                )}

                {columns.map((column) => (
                  <td key={String(column.key)}>
                    <div className="skeleton" />
                  </td>
                ))}

                {actions.length > 0 && (
                  <td>
                    <div className="loading-actions">
                      <div className="skeleton" />
                      <div className="skeleton" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /*
   * =====================================================
   * TABELA VAZIA
   * =====================================================
   */

  if (data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">
          <div className="empty-title">{emptyMessage}</div>

          <div className="empty-description">
            Tente ajustar os filtros ou cadastre um novo registro.
          </div>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * TABELA
   * =====================================================
   */

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="erp-table">
          <thead>
            <tr>
              {selectable && (
                <th className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{
                    width: column.width,
                    textAlign: column.align || "left",
                  }}
                >
                  {column.label}
                </th>
              ))}

              {actions.length > 0 && <th className="actions-column">Ações</th>}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className={isSelected(row) ? "row-selected" : ""}
              >
                {selectable && (
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={isSelected(row)}
                      onChange={() => handleSelectRow(row)}
                    />
                  </td>
                )}

                {columns.map((column) => {
                  const value =
                    column.key in row ? row[column.key as keyof T] : undefined;

                  return (
                    <td
                      key={String(column.key)}
                      style={{
                        textAlign: column.align || "left",
                      }}
                    >
                      {column.render
                        ? column.render(value, row)
                        : String(value ?? "-")}
                    </td>
                  );
                })}

                {actions.length > 0 && (
                  <td className="table-actions">
                    {actions.map((action, actionIndex) => {
                      const disabled = action.disabled
                        ? action.disabled(row)
                        : false;

                      return (
                        <button
                          key={actionIndex}
                          type="button"
                          disabled={disabled}
                          className={`table-action ${
                            action.variant || "secondary"
                          }`}
                          onClick={() => action.onClick(row)}
                        >
                          {action.label}
                        </button>
                      );
                    })}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =================================================
          FOOTER
         ================================================= */}

      <div className="table-footer">
        <div className="table-info">
          {totalItems !== undefined ? (
            <>
              Mostrando {data.length} de {totalItems} registros
            </>
          ) : (
            <>Mostrando {data.length} registros</>
          )}
        </div>

        {totalPages > 1 && (
          <div className="table-pagination">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={pageNumber === page ? "active" : ""}
                  onClick={() => onPageChange?.(pageNumber)}
                >
                  {pageNumber}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
