export const dashboard_id_8 = {
  'id': 8,
  'title': 'Test 2',
  'filters': [],
  'headers': [{
    'text': 'Moved To Dashboard Date',
    'type': 'datetime',
    'value': 'moved_to_dashboard_date',
    'description': 'Datetime that an entity was moved to the dashboard that it is currently on.'
  }, {
    'text': 'Created By',
    'type': 'user',
    'value': 'created_by',
    'description': 'User that created this entity. Refers to users.id'
  }, {
    'text': 'Moved To Dashboard By',
    'type': 'user',
    'value': 'moved_to_dashboard_by',
    'description': 'User that moved the entity to the dashboard that it is currently on. Refers to users.id.'
  }],
  'workspaceId': 9,
  'durationModel': {
    'units': 'minutes',
    'ranges': [{ 'color': 'red', 'order': 0, 'range': [0, 10] }, {
      'color': '#283593FF',
      'order': 1,
      'range': [11, 15]
    }, { 'color': '#33691EFF', 'order': 2, 'range': [16, 60] }],
    'outOfRangeColor': 'grey'
  },
  'displayDuration': true,
  'newEntityFormId': 7,
  'displayNewButton': true
}
