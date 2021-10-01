export const example_form = {
  id: 100,
    title: "Dashboard Create Form",
    // JSON Schema definition utilizing the format required by this library:
    // https://koumoul-dev.github.io/vuetify-jsonschema-form/latest/getting-started
    grid: [],
    // Global Options
    options: {
    timePickerProps: {
      format: "24h",
    },
  },
  schema: {
    type: "object",
      // properties: {},
      properties: {
      id: {
        type: "integer",
          title: "ID",
          description: "Unique ID",
          readOnly: true,
          "x-if": "show_id",
      },
      created_date: {
        type: "string",
          title: "Created Date",
          format: "date-time",
          description: "This description is used as a help message.",
          readOnly: true,
          "x-if": "show_created_date",
      },
      created_by: {
        type: "integer",
          title: "Created By",
          "x-fromData": "context.users",
          "x-itemKey": "val",
          "x-itemTitle": "label",
          description: "This description is used as a help message.",
          readOnly: true,
          "x-if": "show_created_by",
      },
      updated_by: {
        type: "integer",
          title: "Updated By",
          "x-fromData": "context.users",
          "x-itemKey": "val",
          "x-itemTitle": "label",
          description: "This description is used as a help message.",
          readOnly: true,
          "x-if": "show_updated_by",
      },
      source: {
        type: "string",
          title: "Source",
          description: "Source",
          readOnly: true,
          "x-if": "show_source",
      }
    },
  },
}
