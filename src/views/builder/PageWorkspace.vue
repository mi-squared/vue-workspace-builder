<template>
  <v-container>
    <v-card flat>
      <v-card-title>Properties</v-card-title>

      <v-container fluid>
        <v-row dense>
            <v-col cols="4">
              <v-card-text>
                <v-form>
                  <v-text-field label="Title" :value="title"></v-text-field>
                  <v-select label="Administrator" :items="administrators" item-text="displayName" item-value="userId" hint="The administrator of this workspace" persistent-hint></v-select>
                  <v-switch
                    label="Display as patient menu item"
                    ></v-switch>
                </v-form>
              </v-card-text>
            </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card flat>
      <v-toolbar flat>
        <v-toolbar-title>Menu Items</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                text
                class="align-self-center mr-4"
                v-bind="attrs"
                v-on="on"
            >
              <v-icon>
                mdi-plus
              </v-icon>
              New
            </v-btn>
          </template>

          <v-list class="grey lighten-3">

            <v-list-item :key="`table`">Table</v-list-item>
            <v-list-item :key="`form`">Form</v-list-item>

          </v-list>
        </v-menu>
      </v-toolbar>

      <v-card-text>
        <v-card-text class="text-left">This is the order that the dashboard views are displayed in the menu</v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Title
              </th>
              <th class="text-left">
                Type
              </th>
              <th class="text-left">
                Enabled
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in views"
                :key="item.title"
            >
              <td class="text-left">{{ item.title }}</td>
              <td class="text-left">{{ item.type }}</td>
              <td class="text-left">{{ item.enabled }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
<!--  <legend id="headingOne" class="mt-xl-5">-->
<!--    Views-->
<!--    <div class="dropdown pull-right m-1 ">-->
<!--      <button ref="showInputButton" @click="showInput=!showInput;" class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
<!--        New-->
<!--      </button>-->
<!--      <div ref="dropdown" v-if="showInput"  class="dropdown-menu popover-custom" aria-labelledby="dropdownMenuButton">-->
<!--        <a class="dropdown-item" href="#">Form</a>-->
<!--        <a class="dropdown-item" href="#">Dashboard</a>-->
<!--        <a class="dropdown-item" href="#">Read-only</a>-->
<!--      </div>-->
<!--    </div>-->
<!--  </legend>-->

<!--  <table class="table table-hover">-->
<!--    <thead>-->
<!--    <tr>-->
<!--      <th scope="col">#</th>-->
<!--      <th scope="col">Title</th>-->
<!--      <th scope="col">Type</th>-->
<!--      <th scope="col">Enabled</th>-->
<!--      <th scope="col">&nbsp; &lt;!&ndash; actions &ndash;&gt;</th>-->
<!--    </tr>-->
<!--    </thead>-->
<!--    <tbody>-->
<!--    <tr>-->
<!--      <th scope="row">1</th>-->
<!--      <td>Triage</td>-->
<!--      <td>Main Dashboard</td>-->
<!--      <td><i class="fa fa-check"></i></td>-->
<!--      <td><i class="fa fa-copy"></i></td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <th scope="row">2</th>-->
<!--      <td>CET</td>-->
<!--      <td>Dashboard</td>-->
<!--      <td><i class="fa fa-check"></i></td>-->
<!--      <td><i class="fa fa-copy"></i></td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <th scope="row">3</th>-->
<!--      <td>Cigna</td>-->
<!--      <td>Dashboard</td>-->
<!--      <td><font-awesome-icon icon="check"></font-awesome-icon></td>-->
<!--      <td><font-awesome-icon icon="copy"></font-awesome-icon></td>-->
<!--    </tr>-->
<!--    </tbody>-->
<!--  </table>-->

<!--  <legend id="headingOne" class="mt-xl-5">Triggers<button type="button" class="pull-right m-1 btn btn-primary" data-toggle="modal" data-target="#noteModal"><i class="fa fa-plus"></i> New</button>-->
<!--  </legend>-->

<!--  <table class="table table-hover">-->
<!--    <thead>-->
<!--    <tr>-->
<!--      <th scope="col">#</th>-->
<!--      <th scope="col">Event</th>-->
<!--      <th scope="col">Filter</th>-->
<!--      <th scope="col">Action</th>-->
<!--    </tr>-->
<!--    </thead>-->
<!--    <tbody>-->
<!--    <tr>-->
<!--      <th scope="row">1</th>-->
<!--      <td>Attrition</td>-->
<!--      <td>&gt; 60 min.</td>-->
<!--      <td>Add Row Attribute "urgent"</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <th scope="row">2</th>-->
<!--      <td>On Create</td>-->
<!--      <td>From Cigna</td>-->
<!--      <td>Add Row Attribute "green"</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <th scope="row">2</th>-->
<!--      <td>On Create</td>-->
<!--      <td>DUP Check</td>-->
<!--      <td>Add Row Attribute "blue"</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <th scope="row">2</th>-->
<!--      <td>On Create</td>-->
<!--      <td>Is High Utilizer?</td>-->
<!--      <td>Set is_high_utilzer = true</td>-->
<!--    </tr>-->
<!--    </tbody>-->
<!--  </table>-->

</template>

<script>

export default {
  name: "PageWorkspace",
  data () {
    return {
      showInput: false,
    }
  },
  computed: {
    activeWorkspace () {
      return this.$store.state.workspaces[this.$store.state.userState.activeWorkspace]
    },
    title () {
      return this.activeWorkspace.title
    },
    administrators () {
      return this.$store.state.administrators
    },
    views () {
      return this.activeWorkspace.views
    }
  }
}
</script>

<style scoped>

</style>
