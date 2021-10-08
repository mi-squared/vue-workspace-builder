export const workspace = {
  "id": 9,
  "forms": { "7": 7 },
  "title": "ken",
  "actions": {},
  "filters": {},
  "dashboards": { "6": 6, "8": 8 },
  "dataSource": {
    "spec": {
      "columns": {
        "id": {
          "name": "id",
          "type": "integer",
          "extra": {
            "createdBy": "system",
            "category": "system"
          },
          "comment": "Unique identifier for this entity.",
          "default": ""
        },
        "pid": {
          "name": "pid",
          "type": "patient",
          "extra": {
            "createdBy": "system",
            "category": "custom"
          },
          "comment": "The patient that this data source entity is related to.",
          "default": ""
        },
        "sex": {
          "name": "sex",
          "type": "list",
          "extra": {
            "listId": "sex",
            "category": "custom"
          },
          "title": "[New Data Source Column]",
          "comment": "test"
        },
        "desc": {
          "name": "desc",
          "type": "text",
          "extra": {
            "category": "custom"
          },
          "title": "[New Data Source Column]",
          "comment": "dfsdf"
        },
        "test": {
          "name": "test",
          "type": "string",
          "extra": {
            "category": "custom"
          },
          "title": "[New Data Source Column]",
          "comment": "test"
        },
        "source": {
          "name": "source",
          "type": "string",
          "extra": {
            "createdBy": "system",
            "category": "custom"
          },
          "comment": "The source of the entity, whether form, api or some other entry-point.",
          "default": ""
        },
        "test_str": {
          "name": "test_str",
          "type": "string",
          "extra": {
            "category": "custom"
          },
          "title": "[New Data Source Column]",
          "comment": "test"
        },
        "insurance": {
          "name": "insurance",
          "type": "list",
          "extra": {
            "listId": "Private_Insurance",
            "category": "custom"
          },
          "title": "[New Data Source Column]",
          "comment": "test"
        },
        "something": {
          "name": "something",
          "type": "string",
          "extra": {
            "createdDate": 1633048178530,
            "category": "custom"
          },
          "title": "[New Data Source Column]",
          "comment": "this is something"
        },
        "created_by": {
          "name": "created_by",
          "type": "user",
          "extra": {
            "createdBy": "system",
            "category": "system"
          },
          "comment": "User that created this entity. Refers to users.id",
          "default": ""
        },
        "updated_by": {
          "name": "updated_by",
          "type": "user",
          "extra": {
            "createdBy": "system",
            "category": "system"
          },
          "comment": "User that last updated any field on this entity. Refers to users.id.",
          "default": ""
        },
        "dashboard_id": {
          "name": "dashboard_id",
          "type": "integer",
          "extra": {
            "createdBy": "system",
            "category": "system"
          },
          "comment": "Refers to the dashboard that the entity is currently on, OR NULL if not on a dashboard.",
          "default": ""
        },
        "string_thing": {
          "name": "string_thing",
          "type": "string",
          "extra": {
            "category": "custom"
          },
          "title": "[New Data Source Column]",
          "comment": "test"
        },
        "test_textgraph": {
          "name": "test_textgraph",
          "type": "text",
          "extra": {
            "category": "custom"
          },
          "title": "[New Data Source Column]",
          "comment": ""
        },
        "gender_identity": {
          "name": "gender_identity",
          "type": "list",
          "extra": {
            "listId": "Gender_Identity",
            "category": "custom"
          },
          "title": "[New Data Source Column]",
          "comment": "gender identity"
        },
        "created_datetime": {
          "name": "created_datetime",
          "type": "datetime",
          "extra": {
            "createdBy": "system",
            "category": "system"
          },
          "comment": "Date and time that this entity was created.",
          "default": ""
        },
        "updated_datetime": {
          "name": "updated_datetime",
          "type": "datetime",
          "extra": {
            "createdBy": "system",
            "category": "system"
          },
          "comment": "Date and time that this entity was last updated.",
          "default": ""
        },
        "moved_to_dashboard_by": {
          "name": "moved_to_dashboard_by",
          "type": "user",
          "extra": {
            "createdBy": "system",
            "category": "system"
          },
          "comment": "User that moved the entity to the dashboard that it is currently on. Refers to users.id.",
          "default": ""
        },
        "moved_to_dashboard_date": {
          "name": "moved_to_dashboard_date",
          "type": "datetime",
          "extra": {
            "createdBy": "system",
            "category": "system"
          },
          "comment": "Datetime that an entity was moved to the dashboard that it is currently on.",
          "default": ""
        }
      }, "indexes": [{ "key": "PRIMARY", "column": "id" }]
    }
  },
  "administrator": "",
  "displayOnPatientMenu": false
}
