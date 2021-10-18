<template>
  <span :title="timestamp | humanFriendlyDate(timezone)">{{timestamp | humanFriendlyDate(timezone)}}</span>
</template>
<script>
import moment from 'moment-timezone'
export default {
  name: 'AppDate',
  props: {
    timestamp: {
      required: true,
      type: String
    },
    timezone: {
      required: true,
      type: String
    }
  },
  filters: {
    humanFriendlyDate (ts, timezone) {
      let formatted = ''
      const rightHereRightNow = moment();
      let rightNow = rightHereRightNow.clone().tz(timezone).format();
      let rightNowISO = moment(rightNow).toISOString()
      const timestamp = moment.tz(ts, timezone).toISOString()
      if (moment(timestamp).isSame(rightNowISO, 'hour')) {
        formatted = moment(timestamp).fromNow()
      } else if (moment(timestamp).isSame(rightNowISO, 'day')) {
        formatted = moment(timestamp).format('[Today at] h:mmA')
      } else if (moment(timestamp).isSame(rightNowISO, 'week')) {
        formatted = moment(timestamp).format('ddd h:mmA')
      } else if (moment(timestamp).isSame(rightNowISO, 'month')) {
        formatted = moment(timestamp).format('MMM D')
      } else if (moment(timestamp).isSame(rightNowISO, 'year')) {
        formatted = moment(timestamp).format('MMM D')
      } else {
        formatted = moment(timestamp).format('MMM D, YYYY')
        // formatted = moment(timestamp).format('llll')
      }
      return formatted
    }
  }
}
</script>
<style scoped>
</style>
