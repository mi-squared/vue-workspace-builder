<template>
  <WorkspaceBuilder :workspace="workspace" :key="workspaceId"></WorkspaceBuilder>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { GET_WORKSPACE } from '../../store/types-workspace'
import WorkspaceBuilder from '../../components/WorkspaceBuilder'
const { mapState: mapWorkspaceState, mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
export default {
  name: "PageWorkspace",
  components: { WorkspaceBuilder },
  props: {
    workspaceId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      ...mapWorkspaceState,
    }
  },
  computed: {
    ...mapWorkspaceGetters({
      getWorkspace: GET_WORKSPACE
    }),
    workspace () {
      return this.getWorkspace(this.workspaceId)
    },
  },
  methods: {
    ...mapWorkspaceActions
  }
}
</script>

<style scoped>

</style>
