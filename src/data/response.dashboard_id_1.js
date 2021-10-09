export const dashboard_id_1 = {
  'id': 1,
  'title': 'Triage Dashboard',
  'filters': { '1200': 1200, '1201': 1201 },
  'headers': [{ 'text': 'Added', 'value': 'moved_to_dashboard_date' }, {
    'text': 'First Name',
    'align': 'start',
    'value': 'fname'
  }, { 'text': 'Last Name', 'align': 'start', 'value': 'lname' }, {
    'text': 'DOB',
    'value': 'DOB'
  }, { 'text': 'Facility', 'value': 'facility' }, { 'text': 'Status', 'value': 'status' }, {
    'text': 'Triage',
    'value': 'dispatch_triage'
  }, { 'text': '', 'value': 'data-table-expand', 'groupable': false }, {
    'text': '',
    'value': 'data-menu',
    'sortable': false,
    'groupable': false
  }],
  'workspaceId': 1,
  'durationModel': {
    'units': 'days',
    'ranges': [{ 'color': '#E64A19FF', 'order': 0, 'range': [0, 30] }, {
      'color': '#338116FF',
      'order': 1,
      'range': [31, 60]
    }, { 'color': '#303F9FFF', 'order': 2, 'range': [61, 90] }, {
      'color': '#5E35B1FF',
      'order': 3,
      'range': [91, 120]
    }, { 'color': '#7CB342FF', 'order': 4, 'range': [121, 150] }, {
      'color': '#E57373FF',
      'order': 5,
      'range': [151, 180]
    }],
    'outOfRangeColor': 'grey'
  },
  'displayDuration': true,
  'newEntityFormId': 7,
  'displayNewButton': true
}
