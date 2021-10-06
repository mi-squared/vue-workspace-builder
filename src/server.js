import { belongsTo, createServer, hasMany, Model, Serializer } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,

    models: {
      workspace: Model.extend({
        form: hasMany()
      }),
      form: Model.extend({
        workspace: belongsTo()
      })
    },

    serializers: {
      workspace: Serializer.extend({
        embed: true,
        root: false
      })
    },

    seeds(server) {
      server.create("workspace", {
        id: 6,
        forms: [],
        title: "Test 333",
        actions: [],
        filters: [],
        dashboards: [],
        dataSource: {
          spec: {
            columns: {
              id: {
                name: "id",
                type: "integer",
                extra: {
                  createdBy: "system"
                },
                comment: "Unique identifier for this entity.",
                default: ""
              },
              pid: {
                name: "pid",
                type: "patient",
                comment:
                  "The patient that this data source entity is related to.",
                default: ""
              },
              source: {
                name: "source",
                type: "string",
                extra: {
                  createdBy: "system"
                },
                comment:
                  "The source of the entity, whether form, api or some other entry-point.",
                default: ""
              },
              created_by: {
                name: "created_by",
                type: "user",
                extra: {
                  createdBy: "system"
                },
                comment: "User that created this entity. Refers to users.id",
                default: ""
              },
              updated_by: {
                name: "updated_by",
                type: "user",
                extra: {
                  createdBy: "system"
                },
                comment:
                  "User that last updated any field on this entity. Refers to users.id.",
                default: ""
              },
              dashboard_id: {
                name: "dashboard_id",
                type: "integer",
                extra: {
                  createdBy: "system"
                },
                comment:
                  "Refers to the dashboard that the entity is currently on, OR NULL if not on a dashboard.",
                default: ""
              },
              created_datetime: {
                name: "created_datetime",
                type: "datetime",
                extra: {
                  createdBy: "system"
                },
                comment: "Date and time that this entity was created.",
                default: ""
              },
              updated_datetime: {
                name: "updated_datetime",
                type: "datetime",
                extra: {
                  createdBy: "system"
                },
                comment: "Date and time that this entity was last updated.",
                default: ""
              },
              moved_to_dashboard_by: {
                name: "moved_to_dashboard_by",
                type: "user",
                extra: {
                  createdBy: "system"
                },
                comment:
                  "User that moved the entity to the dashboard that it is currently on. Refers to users.id.",
                default: ""
              },
              moved_to_dashboard_date: {
                name: "moved_to_dashboard_date",
                type: "datetime",
                extra: {
                  createdBy: "system"
                },
                comment:
                  "Datetime that an entity was moved to the dashboard that it is currently on.",
                default: ""
              }
            },
            indexes: [
              {
                key: "PRIMARY",
                column: "id"
              }
            ]
          }
        },
        administrator: "",
        displayOnPatientMenu: false
      });
    },

    routes() {
      this.namespace = process.env.VUE_APP_BASE_URL;

      this.get(
        "/interface/modules/custom_modules/oe-workspace-server/init.php",
        () => {
          return {
            csrfToken: "ff8a6d73d1751f3cdf5752de4bc4493899427cd0",
            userId: "1",
            username: "admin"
          };
        }
      );

      this.get("/apis/api/workspaces", schema => {
        return schema.workspaces.all();
      });
    }
  });

  return server;
}