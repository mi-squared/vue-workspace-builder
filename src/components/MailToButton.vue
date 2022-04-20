<template>
  <v-menu
    :close-on-click="closeOnClick"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-gmail</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, index) in templateList"
        :key="index"
      >
        <v-list-item-title>
          <a @click="prepareAndOpenClient(item)">{{ item.text }}</a>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'MailToButton',
  props: {
    entity: {
      type: Object,
      required: true
    },
    templateList: {
      type: Array,
      required: true
    }
  },
  methods: {
    prepareAndOpenClient(item) {
      // create a "coordinator" key for receipt of form (round trip)
      const coordinatorKey = this.entity.id
      // automatically create a note that will log this action

      // build the mailto dynamically
      // window.location = "mailto:mlundeen@crisisprepandrecovery.com?subject=CPR%20E-Signature%20Consent%20Forms&body=Hi%20Amy.%20Please%20follow%20this%20link%20to%20E-Sign%20your%20consent%20forms%20for%20your%20upcoming%20appointment%20with%20CPR.%0A%0Ahttps%3A%2F%2Fform.jotform.com%2F210535749373157"
      const body = "Hi " + this.entity.fname + ", \n" +
        "Please follow this link to sign your " + item.text + "\n" +
        "https//form.jotform.com/" + item.value + "?oe_key=" + coordinatorKey
      const subject = item.text
      const mailto = "mailto:" +
        this.entity.email +
        "?subject=" + subject +
        "&body=" + body
      window.location = encodeURI(mailto)

      this.$emit('save', {
        entity: this.entity,
        text: "A `" + item.text + "` was initiated.",
        coordinatorKey: coordinatorKey
      })
    }
  }
}
</script>

<style scoped>

</style>
