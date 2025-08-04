import React from "react";
import Pagination from "./Pagination";
import "@/assets/styles/common/data-table.css";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const DataTable = ({
  columns,
  data,
  loading,
  pagination,
  sort,
  rowClassName,
}) => {
  const { sortBy, sortOrder, onSortChange } = sort || {};

  if (loading) {
    return (
      <div className="data-table__loading">
        <LoadingSpinner text="Đang tải dữ liệu..." />
      </div>
    );
  }

  const handleSortClick = (colKey) => {
    if (!onSortChange || !colKey) return;
    const newOrder = sortBy === colKey && sortOrder === "asc" ? "desc" : "asc";
    onSortChange(colKey, newOrder);
  };

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => {
              const isSortable = !!col.key;
              const isSorted = col.key === sortBy;

              return (
                <th
                  key={idx}
                  className={isSortable ? "sortable" : ""}
                  onClick={() => isSortable && handleSortClick(col.key)}
                >
                  {col.label}
                  {isSortable && (
                    <span className="sort-icon">
                      {isSorted ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center"
              >
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={
                  typeof rowClassName === "function" ? rowClassName(row) : ""
                }
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="data-table__pagination">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;
