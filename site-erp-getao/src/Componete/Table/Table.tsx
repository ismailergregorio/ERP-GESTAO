import "./Table.css";

import type { TableProps } from "./Table.types";

export default function Table<T extends { id: number | string }>({

    columns,
    data,
    children,

}: TableProps<T>) {

    return (

        <div className="table-container">

            <table className="table">

                <thead>

                    <tr>

                        {columns.map(column => (

                            <th
                                key={String(column.key)}
                                style={{
                                    width: column.width,
                                    textAlign: column.align
                                }}
                            >
                                {column.title}
                            </th>

                        ))}

                        {children && (

                            <th
                                style={{
                                    width: "120px",
                                    textAlign: "center"
                                }}
                            >
                                Ações
                            </th>

                        )}

                    </tr>

                </thead>

                <tbody>

                    {data.map(row => (

                        <tr key={row.id}>

                            {columns.map(column => (

                                <td
                                    key={String(column.key)}
                                    style={{
                                        textAlign: column.align
                                    }}
                                >

                                    {column.render
                                        ? column.render(row[column.key], row)
                                        : String(row[column.key])
                                    }

                                </td>

                            ))}

                            {children && (

                                <td className="table-actions">

                                    {children(row)}

                                </td>

                            )}

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}