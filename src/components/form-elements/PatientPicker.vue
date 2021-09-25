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
          <v-date-picker
            v-model="patient.DOB"
            color="blue darken-2"
            label="DOB"
            required
          ></v-date-picker>
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer
      absolute
      temporary
      right
      v-model="drawer"
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/women/81.jpg">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Jane Smith</v-list-item-title>
            <v-list-item-subtitle>Logged In</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="match in matches"
          :key="match.pid"
        >
          <v-list-item-content>
            <v-list-item-title>{{ match.fname }} {{ match.lname }}</v-list-item-title>
          </v-list-item-content>
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
      drawer: false
    }
  }
}
</script>

<style scoped>

</style>
