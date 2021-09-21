export function createForm(workspaceId, formData) {
  return {
    id: Math.floor(Math.random() * 32768),
    workspaceId: workspaceId,
    title: "[New Form]",
    formDefinition: {
      grid: [],
      schema: {},
      options: {},
    },

    ...formData,
  };
}
