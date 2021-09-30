<template>
  <WorkspaceBuilder :workspace="workspace" :key="workspaceId"></WorkspaceBuilder>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { CREATE_WORKSPACE, FETCH_WORKSPACE, GET_WORKSPACE } from '../../store/types-workspace'
import WorkspaceBuilder from '../../components/WorkspaceBuilder'
import { INIT } from '../../store/types-user'
const { mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
const { mapActions: mapUserActions } = createNamespacedHelpers('user')

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
    return {}
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
    ...mapWorkspaceActions({
      fetchWorkspace: FETCH_WORKSPACE,
      createWorkspace: CREATE_WORKSPACE
    }),
    ...mapUserActions({
      initUser: INIT
    }),
  },

}
</script>

<style scoped>

</style>
