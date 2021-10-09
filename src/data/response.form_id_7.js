export const form_id_7 = {
  'id': 7,
  'grid': [{
    'h': 2,
    'i': 0,
    'w': 12,
    'x': 0,
    'y': 2,
    'meta': { 'name': 'source', 'type': 'string' },
    'moved': false
  }, {
    'h': 2,
    'i': 1,
    'w': 12,
    'x': 2,
    'y': 4,
    'meta': { 'name': 'something', 'type': 'string' },
    'moved': false
  }, {
    'h': 2,
    'i': 2,
    'w': 12,
    'x': 0,
    'y': 0,
    'meta': { 'name': 'pid', 'type': 'patient' },
    'moved': false
  }, {
    'h': 2,
    'i': 3,
    'w': 12,
    'x': 6,
    'y': 6,
    'meta': { 'name': 'insurance', 'type': 'list' },
    'moved': false
  }, { 'h': 2, 'i': 4, 'w': 12, 'x': 8, 'y': 8, 'meta': { 'name': 'sex', 'type': 'list' }, 'moved': false }],
  'title': 'Test',
  'schema': {
    'properties': {
      'pid': {
        'type': 'integer',
        'x-if': 'context.show_pid',
        'title': 'pid',
        'x-cols': 12,
        'readOnly': true,
        'x-display': 'custom-patient',
        'x-itemKey': 'val',
        'x-fromData': 'context.patient',
        'description': 'The patient that this data source entity is related to.',
        'x-itemTitle': 'label',
        'dataSourceColumn': 'pid'
      },
      'sex': {
        'type': 'string',
        'x-if': 'context.show_sex',
        'title': 'sex',
        'listId': 'sex',
        'x-cols': 12,
        'x-display': 'autocomplete',
        'x-itemKey': 'value',
        'x-fromData': 'context.sex_items',
        'description': 'test',
        'x-itemTitle': 'text',
        'dataSourceColumn': 'sex'
      },
      'source': {
        'type': 'string',
        'x-if': 'context.show_source',
        'title': 'source',
        'format': 'string',
        'x-cols': 12,
        'readOnly': false,
        'description': '',
        'dataSourceColumn': 'source'
      },
      'insurance': {
        'type': 'string',
        'x-if': 'context.show_insurance',
        'title': 'insurance',
        'listId': 'Private_Insurance',
        'x-cols': 12,
        'x-display': 'autocomplete',
        'x-itemKey': 'value',
        'x-fromData': 'context.insurance_items',
        'description': 'test',
        'x-itemTitle': 'text',
        'dataSourceColumn': 'insurance'
      },
      'something': {
        'type': 'string',
        'x-if': 'context.show_something',
        'title': 'something',
        'format': 'string',
        'x-cols': 12,
        'description': 'this is something',
        'conditionalLogic': {
          'action': 'Hide',
          'conditions': [{ 'field': 'source', 'value': '2', 'operator': '=' }],
          'logicalType': 'Any'
        },
        'dataSourceColumn': 'something',
        'hasConditionalLogic': true
      }
    }
  },
  'options': {},
  'workspaceId': 1
}
