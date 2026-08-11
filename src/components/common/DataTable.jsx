import React from 'react';

export const DataTable = ({ columns = [], data = [], emptyMessage = 'No records found.' }) => {
  if (data.length === 0) {
    return null; // Empty state should be handled by parent or empty container
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key || col.label} style={col.style}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={row.id || rIdx}>
              {columns.map((col) => (
                <td key={col.key || col.label} style={col.style}>
                  {col.render ? col.render(row, rIdx) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
