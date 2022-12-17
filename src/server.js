import {
  belongsTo,
  createServer,
  hasMany,
  Model,
  // Serializer,
  RestSerializer
} from "miragejs";

import { dataTypes as dataTypesResponse } from "./data/response.datatypes";
import { fetchlists as fetchListResponse } from "./data/response.fetchlists";
import { fetchlistdata as fetchListDataResponse } from "./data/response.fetchlistdata";
// import dataSourceTemplate from "./data/_data_source_template.json";

import { init as initResponse } from "./data/response.init";

const RelatedIdSerializer = RestSerializer.extend({
  serialize() {
    const json = RestSerializer.prototype.serialize.apply(this, arguments);

    // pivot arrays in the default RestSerializer into object index notation
    // for the embedded responses
    // eg: forms: {'1':1, '7':7}
    this.include.forEach(e => {
      if (json instanceof Array) {
        json.forEach(row => {
          row[e] = row[e].reduce((a, v) => ({ ...a, [v.id]: v.id }), {});
        });
      } else if (json instanceof Object) {
        json[e] = json[e].reduce((a, v) => ({ ...a, [v.id]: v.id }), {});
      }
    });

    return json;
  }
});

// TODO add the dataSource to all workspace responses and use this serializer for workspace responses
// const WorkspaceSerializer = Serializer.extend({
//   serialize() {
//     const json = RelatedIdSerializer.prototype.serialize.apply(this, arguments);
//     json.dataSource = dataSourceTemplate
//     return json;
//   }
// });

const ApplicationSerializer = RestSerializer.extend({
  serialize() {
    const json = RestSerializer.prototype.serialize.apply(this, arguments);

    // pivot arrays in the default RestSerializer into object notation for
    // all of the included models
    this.include.forEach(e => {
      if (json instanceof Array) {
        json.forEach(row => {
          row[e] = row[e].reduce((a, v) => ({ ...a, [v.id]: v }), {});
        });
      } else if (json instanceof Object) {
        json[e] = json[e].reduce((a, v) => ({ ...a, [v.id]: v }), {});
      }
    });

    return json;
  }
});

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,

    models: {
      workspace: Model.extend({
        forms: hasMany(),
        dashboards: hasMany()
      }),
      form: Model.extend({
        workspace: belongsTo()
      }),
      dashboard: Model.extend({
        workspace: belongsTo()
      })
    },

    serializers: {
      workspace: RelatedIdSerializer.extend({
        embed: true,
        root: false,
        include: ["forms", "dashboards"]
      }),
      form: ApplicationSerializer.extend({
        embed: true,
        root: false
      }),
      dashboard: ApplicationSerializer.extend({
        embed: true,
        root: false
      })
    },

    seeds(server) {
      server.create("workspace", {
        id: 6,
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
      this.namespace = import.meta.VITE_BASE_URL;

      this.get(
        "/interface/modules/custom_modules/oe-workspace-server/init.php",
        () => {
          return initResponse;
        }
      );

      this.get("/apis/api/workspaces", schema => {
        return schema.workspaces.all();
      });

      this.get("/apis/api/fetchlists", () => {
        return fetchListResponse;
      });

      this.get("/apis/api/datatypes", () => {
        return dataTypesResponse;
      });

      this.post("/apis/api/form", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);

        let form = schema.forms.create({
          workspaceId: attrs.params.workspaceId,
          ...attrs.params.form
        });

        //let workspace = schema.workspaces.find(attrs.params.workspaceId);
        return form;
      });

      this.put("/apis/api/form", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);

        let form = schema.forms.find(attrs.params.form.id);
        form.update({ ...attrs.params.form });

        return form;
      });

      this.get("/apis/api/form", (schema, request) => {
        let form = schema.forms.find(request.queryParams.id);

        return form;
      });

      this.put("/apis/api/workspace", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        let workspace = schema.workspaces.find(attrs.params.id);
        // TODO
        // workspace.update({...attrs.params.workspace})
        return workspace;
      });

      this.post("/apis/api/fetchlistdata", () => {
        return fetchListDataResponse;
      });

      this.post("/apis/api/dashboard", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);

        let dashboard = schema.dashboards.create({
          workspaceId: attrs.params.workspaceId,
          ...attrs.params.dashboard
        });

        return dashboard;
      });

      this.get("/apis/api/dashboard", (schema, request) => {
        let dashboard = schema.dashboards.find(request.queryParams.id);

        return dashboard;
      });
    }
  });

  return server;
}
