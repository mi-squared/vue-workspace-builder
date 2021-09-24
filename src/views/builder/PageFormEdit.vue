<template>

  <div id="page-form-edit">

    <v-toolbar dense flat>

      <v-app-bar-nav-icon @click="navigationHamburgerClicked"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ this.form.title }}</v-toolbar-title>

    </v-toolbar>

    <FormBuilder :form="form" :workspace="workspace" :key="form.id"></FormBuilder>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { GET_WORKSPACE } from '../../store/types-workspace'
const { mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
import { ALL_FORMS, GET_FORM } from '../../store/types-form'
import FormBuilder from '../../components/FormBuilder'
const { mapGetters: mapFormGetters } = createNamespacedHelpers('form')

export default {
  name: "PageFormEdit",
  components: { FormBuilder },
  props: {
    workspaceId: {
      type: Number,
      required: true
    },
    formId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapWorkspaceGetters({
      getWorkspace: GET_WORKSPACE
    }),
    ...mapFormGetters({
      getForm: GET_FORM,
      forms: ALL_FORMS
    }),
    workspace() {
      return this.getWorkspace(this.workspaceId)
    },
    form() {
      return this.getForm(this.formId)
    },
  },
  methods: {
    navigationHamburgerClicked() {
      this.$emit('hamburger-navigation-clicked')
    },
  },
  mounted() {
    console.log("PageFormEdit mounted")
  },
}
</script>

<style scoped></style>
