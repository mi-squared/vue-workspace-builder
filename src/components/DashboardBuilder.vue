<template>
  <v-row height="1000">
    <!-- column for holding the dashboard properties -->
    <v-col
        cols="8"
    >

      <v-expansion-panels
          multiple
      >
        <v-expansion-panel>
          <v-expansion-panel-header>{{ this.dashboard.title }} Properties</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-text-field
                label="Title"
                hide-details="auto"
                v-model="this.dashboard.title"
                required
            ></v-text-field>
            <v-text-field label="Another input"></v-text-field>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>{{ this.dashboard.title }} Columns</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item-group
                  color="primary"
              >
                <draggable
                    id="first"
                    :list="dashboardColumns"
                    draggable=".v-list-item"
                    group="a"
                >
                  <v-list-item
                      v-for="element in dashboardColumns"
                      :key="element.text"
                      @click="dashboardElementClicked(element)"
                      color="primary"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-drag-vertical</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="element.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </draggable>

              </v-list-item-group>

              <v-list-item>
                <!-- Button to add a new dashboard column -->
                <v-btn @click="add">Add</v-btn>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <!-- end dashboard properties -->

    <!-- when an element is clicked, this should slide out -->
      <v-navigation-drawer
          v-model="drawer"
          absolute
          right
          temporary
          width="420"
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-page-layout-header</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ this.activeDashboardElement.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-form
            ref="form"
            v-model="validElement"
            lazy-validation
        >
          <v-container>
            <v-text-field
                v-model="activeDashboardElement.text"
                :counter="10"
                label="Name"
                required
            ></v-text-field>

<!--            <v-text-field-->
<!--                v-model="email"-->
<!--                :rules="emailRules"-->
<!--                label="E-mail"-->
<!--                required-->
<!--            ></v-text-field>-->

<!--            <v-select-->
<!--                v-model="select"-->
<!--                :items="items"-->
<!--                :rules="[v => !!v || 'Item is required']"-->
<!--                label="Item"-->
<!--                required-->
<!--            ></v-select>-->

<!--            <v-checkbox-->
<!--                v-model="checkbox"-->
<!--                :rules="[v => !!v || 'You must agree to continue!']"-->
<!--                label="Do you agree?"-->
<!--                required-->
<!--            ></v-checkbox>-->

            <v-btn
                color="success"
                class="mr-4"
                @click="storeActiveDashboardElement"
            >
              Save
            </v-btn>
            <v-btn
                color="secondary"
                class="mr-4"
                @click="drawer = false"
            >
              Cancel
            </v-btn>
          </v-container>
        </v-form>
      </v-navigation-drawer>
  </v-row>

</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "DashboardBuilder",
  components: {
    draggable
  },
  props: {
    dashboardId: {
      type: Number,
      required: true,
    },
    workspaceId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      selectedItem: 1,
      drawer: null,
      activeDashboardElement: {},
      validElement: true,
      dashboardModel: {

      }
    }
  },
  computed: {
    activeWorkspace() {
      return this.$store.state.workspaces[this.workspaceId]
    },
    dashboard() {
      return this.activeWorkspace.dashboards.find(d => d.id === this.dashboardId)
    },
    dashboardColumns() {
      return this.dashboard.headers
    }
  },
  methods: {
    add: function() {
      const newElement = {
        title: '',
        value: ''
      }
      this.dashboard.headers.push(newElement)
      this.dashboardElementClicked(newElement)
    },
    dashboardElementClicked(element) {
      this.$emit('dashboard-element-clicked', element)
      this.showDashboardElementProperties(element)
    },
    dashboardAddElementClicked()
    {

    },
    showDashboardElementProperties(element)
    {
      this.activeDashboardElement = element
      console.log(element)
      this.drawer = true
    },

    /**
     * Save the active element to Vuex
     */
    storeActiveDashboardElement()
    {
      console.log('save clicked')
      this.$store.dispatch("updateDashboard", {
        workspaceId: this.workspaceId,
        dashboardId: this.dashboardId,
        dashboard: this.dashboard
      })
      this.drawer = false
    }
  }
}
</script>
<style scoped></style>
