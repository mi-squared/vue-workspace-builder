<template>
  <v-btn
    icon
    href="mailto:mlundeen@crisisprepandrecovery.com?subject=CPR%20E-Signature%20Consent%20Forms&body=Hi%20Amy.%20Please%20follow%20this%20link%20to%20E-Sign%20your%20consent%20forms%20for%20your%20upcoming%20appointment%20with%20CPR.%0A%0Ahttps%3A%2F%2Fform.jotform.com%2F210535749373157" target="_blank">
    <v-icon>mdi-gmail</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'MailToButton',
  props: {
    toEmail: {
      type: String,
      required: false
    }
  }
}
</script>

<style scoped>

</style>
