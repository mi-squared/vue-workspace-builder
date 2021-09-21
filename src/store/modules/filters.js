filters: [
  {
    id: 199,
    title: 'Column 1 condition',
    logical_operator: 'AND',
    conditions: [
      {
        description: 'Column one greater than 10',
        field: 'column1',
        operator: '>',
        parameter: {
          type: 'const',
          value: '10'
        }
      },
      {
        description: 'Column one less than 20',
        field: 'column1',
        operator: '<',
        parameter: {
          type: 'const',
          value: '20'
        }
      },
      {
        description: 'Column one not equal column two',
        field: 'column1',
        operator: '!=',
        parameter: {
          type: 'field',
          value: 'column2'
        }
      },
    ]
  }
],
