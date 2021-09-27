<template>
  <v-card class="mx-auto" outlined>

    <v-system-bar height="36px">
      <v-spacer></v-spacer>
      3 potential matches
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon @click.stop="drawer = !drawer">mdi-dots-vertical</v-icon>
      </v-btn>
    </v-system-bar>

    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="patient.fname"
            label="First name"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="patient.lname"
            label="Last name"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="patient.DOB"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="patient.DOB"
                label="DOB"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="patient.DOB"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="modal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialog.save(patient.DOB)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer
      absolute
      temporary
      right
      width="520px"
      v-model="drawer"
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Jane Smith</v-list-item-title>
            <v-list-item-subtitle>DOB: 10/21/1990</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          three-line
          v-for="match in matches"
          :key="match.pid"
        >
          <v-list-item-content>
            <v-list-item-title>{{ match.fname }} {{ match.lname }}</v-list-item-title>
            <v-list-item-subtitle>DOB: 10/21/1990</v-list-item-subtitle>
            <v-list-item-subtitle>pid: 1234</v-list-item-subtitle>
          </v-list-item-content>


          <v-list-item-action>
            <v-list-item-action-text v-text="match.text"></v-list-item-action-text>

            <v-btn text>Apply Match</v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: 'PatientPicker',
  props: {
    pid: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      patient: {
          fname: "Ken",
          lname: "Chapple",
          DOB: "1979-10-06",
          pid: "12345"
      },
      matches: [
        {
          fname: "Jen",
          lname: "Dapple",
          pid: 9999
        },
        {
          fname: "Fran",
          lname: "Papple",
          pid: 23
        },
      ],
      drawer: false, // Matching patients nav drawer
      modal: false, // DOB date-picker modal
    }
  }
}
</script>

<style scoped>

</style>
