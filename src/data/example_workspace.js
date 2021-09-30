export const example_workspace = {
  "1": {
    "id": 1,
    "title": "CET",
    "administrator": 1,
    "displayOnPatientMenu": false,
    "dataSource": {
      "spec": {
        "columns": {
          "id": {
            "name": "id",
            "type": "integer",
            "comment": "",
            "extra": {
              "createdBy": "system",
              "createdDate": "2021-06-20"
            }
          },
          "created_date": {
            "name": "created_date",
            "type": "datetime",
            "default": "",
            "comment": "",
            "extra": {
              "createdBy": "system",
              "createdDate": "2021-06-20"
            }
          },
          "created_by": {
            "name": "created_by",
            "type": "user",
            "default": "",
            "comment": "refers to users.id",
            "extra": {
              "createdBy": "system",
              "createdDate": "2021-06-20"
            }
          },
          "updated_date": {
            "name": "updated_date",
            "type": "datetime",
            "default": "",
            "comment": "",
            "extra": {
              "createdBy": "system",
              "createdDate": "2021-06-20"
            }
          },
          "updated_by": {
            "name": "updated_by",
            "type": "user",
            "default": "",
            "comment": "refers to users.id",
            "extra": {
              "createdBy": "system",
              "createdDate": "2021-06-20"
            }
          },
          "source": {
            "name": "source",
            "type": "string",
            "default": "",
            "comment": "",
            "extra": {
              "createdBy": "system",
              "createdDate": "2021-06-20"
            }
          }
        },
        "indexes": {
          "id": {
            "key": "PRIMARY",
            "column": "id"
          }
        }
      }
    },
    "dashboards": {
      "1": 1
    },
    "forms": {
      "1": 1
    },
    "filters": {
      "199": 199
    }
  }
}

