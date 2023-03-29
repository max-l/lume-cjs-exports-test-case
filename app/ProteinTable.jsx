import { useCallback, useMemo, useState, useEffect, Fragment } from "npm:react";

import { useExpanded, useTable } from 'npm:react-table';

// This could be inlined into SubRowAsync, this this lets you reuse it across tables
function SubRows({ row, rowProps, visibleColumns, data, loading }) {
  if (loading) {
    return (
      <tr>
        <td/>
        <td colSpan={visibleColumns.length - 1}>
          Loading...
        </td>
      </tr>
    );
  }

  // error handling here :)

  return (
    <>
      {data.map((x, i) => {
        return (
          <tr
            {...rowProps}
            key={`${rowProps.key}-expanded-${i}`}
          >
            {row.cells.map((cell) => {
              return (
                <td
                  {...cell.getCellProps()}
                >
                  {cell.render(cell.column.SubCell ? 'SubCell' : 'Cell', {
                    value:
                      cell.column.accessor &&
                      cell.column.accessor(x, i),
                    row: { ...row, original: x }
                  })}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

function SubRowAsync({ row, rowProps, visibleColumns }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(dat0);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <SubRows
      row={row}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      data={data}
      loading={loading}
    />
  );
}

function Table({ columns: userColumns, data, renderRowSubComponent }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state: { expanded } // expanded rowId -> isExpanded:boolean
  } = useTable(
    {
      columns: userColumns,
      data
    },
    useExpanded // We can useExpanded to track the expanded state for sub components too!
  )

  return <>
      <pre>
        <code>{JSON.stringify({ expanded: expanded }, null, 2)}</code>
      </pre>
      <table {...getTableProps()} className={"w-full text-sm text-left text-gray-500 dark:text-gray-400"}>
        <thead className={"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"}>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th className={"px-6 py-3"} {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          const rowProps = row.getRowProps();
          return (
            // Use a React.Fragment here so the table markup is still valid
            <Fragment key={rowProps.key}>
              <tr {...rowProps} className={"bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"}>
                {row.cells.map(cell => {
                  return (
                    <td className={"px-6 py-4"} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
              {/* We could pass anything into this */}
              {row.isExpanded &&
                renderRowSubComponent({ row, rowProps, visibleColumns })}
            </Fragment>
          )
        })}
        </tbody>
      </table>
  </>
}

const ProteinTable = () => {
  const columns = useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? '👇' : '👉'}
          </span>
        ),
        // We can override the cell renderer with a SubCell to be used with an expanded row
        SubCell: () => null // No expander on an expanded row
      },
      {
        Header: 'Name',
        columns: [
          {
            Header: 'Protein Accessions',
            // We re-map data using accessor functions for subRows
            accessor: (d) =>
                d[8].map(tt_id => dat0.transcript_translations[tt_id]).join(",")
              ,
            // We can render something different for subRows
            SubCell: (cellProps) => (
              <>🥳 {cellProps.value} 🎉</>
            )
          },
          {
            Header: 'Gene',
            accessor: (d) =>
              d[6].map(g_id => dat0.genes[g_id]).join(",")
          },
          {
            Header: 'Transcript Accession',
            accessor: (d) =>
                d[7].map(t_id => dat0.transcripts[t_id]).join(",")
          }
        ]
      }
    ],
    []
  );

  const data = useMemo(() => dat0, []);

  // Create a function that will render our row sub components
  const renderRowSubComponent = useCallback(
    ({ row, rowProps, visibleColumns }) => (
      <SubRowAsync
        row={row}
        rowProps={rowProps}
        visibleColumns={visibleColumns}
      />
    ),
    []
  );

  return (
      <Table
        columns={columns}
        data={dat0.proteins}
        // We added this as a prop for our table component
        // Remember, this is not part of the React Table API,
        // it's merely a rendering option we created for
        // ourselves
        renderRowSubComponent={renderRowSubComponent}
      />
  );
}

export default ProteinTable

const dat0 = {
  "genes": {
    "5699447": "FUS3",
    "5700469": "FUS1",
    "5708188": "FUS2"
  },
  "transcripts": {
    "13736747": "NM_001178256.1",
    "13737128": "NM_001178672.1",
    "13747109": "NM_001182739.1"
  },
  "transcript_translations": {
    "78647682": "NP_009537.1",
    "78656614": "NP_009903.2",
    "78656616": "IP_001585",
    "78656618": "IP_001586",
    "78655645": "NP_013959.1",
    "78655648": "IP_012221",
    "78655650": "IP_012222",
    "78655646": "IP_012223"
  },
  "proteins": [
    [
      567,
      null,
      0,
      0,
      0,
      0,
      [
        5699447
      ],
      [
        13736747
      ],
      [
        78647682
      ]
    ],
    [
      1584,
      null,
      0,
      0,
      0,
      0,
      [
        5700469
      ],
      [
        13737128
      ],
      [
        78656614
      ]
    ],
    [
      1585,
      null,
      0,
      0,
      0,
      0,
      [
        5700469
      ],
      [
        13737128
      ],
      [
        78656616
      ]
    ],
    [
      1586,
      null,
      0,
      0,
      0,
      0,
      [
        5700469
      ],
      [
        13737128
      ],
      [
        78656618
      ]
    ],
    [
      12220,
      null,
      0,
      0,
      0,
      0,
      [
        5708188
      ],
      [
        13747109
      ],
      [
        78655645
      ]
    ],
    [
      12221,
      null,
      0,
      0,
      0,
      0,
      [
        5708188
      ],
      [
        13747109
      ],
      [
        78655648
      ]
    ],
    [
      12222,
      null,
      0,
      0,
      0,
      0,
      [
        5708188
      ],
      [
        13747109
      ],
      [
        78655650
      ]
    ],
    [
      12223,
      null,
      0,
      0,
      0,
      0,
      [
        5708188
      ],
      [
        13747109
      ],
      [
        78655646
      ]
    ]
  ]
}