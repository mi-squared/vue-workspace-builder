export const example_dashboard = {
  "id": 1,
  "title": "Triage Dashboard",
  "filters": {
    "1200": 1200,
    "1201": 1201
  },
  "headers": [
    {
      "text": "Added",
      "value": "moved_to_dashboard_date"
    },
    {
      "text": "First Name",
      "align": "start",
      "value": "fname"
    },
    {
      "text": "Last Name",
      "align": "start",
      "value": "lname"
    },
    {
      "text": "DOB",
      "value": "DOB"
    },
    {
      "text": "Facility",
      "value": "facility"
    },
    {
      "text": "Status",
      "value": "status"
    },
    {
      "text": "Triage",
      "value": "dispatch_triage"
    },
    {
      "text": "",
      "value": "data-table-expand",
      "groupable": false
    },
    {
      "text": "",
      "value": "data-menu",
      "sortable": false,
      "groupable": false
    }
  ],
  "durationModel": {
    "units": "minutes",
    "ranges": [
      {
        "color": "#EC8116FF",
        "order": 0,
        "range": [
          0,
          30
        ]
      },
      {
        "color": "#338116FF",
        "order": 1,
        "range": [
          31,
          60
        ]
      }
    ],
    "outOfRangeColor": "grey"
  },
  "displayDuration": true,
  "newEntityFormId": null,
  "displayNewButton": false
}
