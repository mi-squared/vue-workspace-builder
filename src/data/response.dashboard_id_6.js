export const dashboard_id_6 = {
  'id': 6,
  'title': 'Ken test 1',
  'filters': [],
  'headers': [{
    'text': 'Moved To Dashboard Date',
    'type': 'datetime',
    'value': 'moved_to_dashboard_date',
    'description': 'Datetime that an entity was moved to the dashboard that it is currently on.'
  }, { 'text': 'DOB', 'type': 'date', 'value': 'DOB', 'description': null }, {
    'text': 'Pid',
    'type': 'patient',
    'value': 'pid',
    'description': 'The patient that this data source entity is related to.'
  }, { 'text': 'City', 'type': 'string', 'value': 'city', 'description': null }, {
    'text': 'Fname',
    'type': 'string',
    'value': 'fname',
    'description': null
  }, { 'text': 'Lname', 'type': 'string', 'value': 'lname', 'description': null }, {
    'text': 'Something',
    'type': 'string',
    'value': 'something',
    'description': 'this is something'
  }, {
    'text': 'Source',
    'type': 'string',
    'value': 'source',
    'description': 'The source of the entity, whether form, api or some other entry-point.'
  }, { 'text': 'City', 'type': 'string', 'value': 'city', 'description': null }],
  'workspaceId': 9,
  'durationModel': {
    'units': 'minutes',
    'ranges': [{ 'color': '#8BC34AFF', 'order': 0, 'range': [0, 1] }, {
      'color': '#3F51B5FF',
      'order': 1,
      'range': [2, 5]
    }, { 'color': '#4A148CFF', 'order': 2, 'range': [6, 360] }, {
      'color': '#F06292FF',
      'order': 3,
      'range': [361, 1440]
    }, { 'color': 'red', 'order': 4, 'range': [1441, 5000] }],
    'outOfRangeColor': 'grey'
  },
  'displayDuration': true,
  'newEntityFormId': 7,
  'displayNewButton': true,
  'dashboardsInWorkspace': { '6': 'Ken test 1', '8': 'Test 2' },
  'workspaces': { '1': 'Crisis', '9': 'ken' }
}
