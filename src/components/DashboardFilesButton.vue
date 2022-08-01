<template>
  <v-row justify="center">
    <v-menu
      :close-on-click="closeOnClick"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            :content="fileCount"
            :value="fileCount"
            :color="getBadgeColor"
            overlap
          >
            <v-icon>
              mdi-attachment
            </v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list v-if="attachments.length">
        <v-list-item
          v-for="(item, index) in attachments"
          :key="index"
        >
          <v-list-item-title>
            <a @click="onClickView(item)">{{ item.title }}</a>
          </v-list-item-title>
          <v-list-item-subtitle>{{ item.status }}</v-list-item-subtitle>

          <v-list-item-icon>
            <v-btn icon @click="onClickView(item)">
              <v-icon :color="getViewColor(item)">mdi-eye-arrow-right-outline</v-icon>
            </v-btn>
          </v-list-item-icon>

          <v-list-item-icon>
            <v-btn
              icon
              @click.stop="onClickApprove(item)"
              :disabled="item.status == 'new' || item.status == ''"
            >
              <v-icon :color="getApproveColor(item)">mdi-check-circle-outline</v-icon>
            </v-btn>
          </v-list-item-icon>

          <v-list-item-icon>
            <v-btn
              icon
              @click.stop="onClickDelete(item)"
              :disabled="item.status == 'approved' || item.status == 'new' || item.status == ''"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-title>No Attachments</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-menu>

    <!-- Confirmation dialog -->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="320"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ confirmTitle }}
        </v-card-title>
        <v-card-text>{{ confirmText }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="gray darken-1"
            text
            @click="onClickCancel()"
          >
            Cancel
          </v-btn>
          <v-btn
            :color="confirmColor"
            text
            @click="onClickConfirm()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import {
  GET_ATTACHMENTS_BY_ENTITY_ID, UPDATE_ATTACHMENT
} from '../store/types-dashboard'

const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

export default {
  name: 'DashboardFilesButton',
  props: {
    entity: {
      type: Object,
      required: true
    },
    dashboard: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      menu: false,
      action: '',
      activeItem: null,
      dialog: false,
      confirmTitle: '',
      confirmText: '',
      confirmColor: '',
    }
  },
  computed: {
    ...mapDashboardGetters({
      getAttachmentsByEntityId: GET_ATTACHMENTS_BY_ENTITY_ID,
    }),
    getBadgeColor () {
      // If the status is approved for all attachments, turn green. Otherwise, the badge is red
      let color = 'green'
      Object.values(this.attachments).forEach(attachment => {
        if (attachment.status == undefined ||
          attachment.status == null ||
          attachment.status == '' ||
          attachment.status == 'new' ||
          attachment.status == 'read'
        ) {
          color = 'red'
        }
      })
      return color
    },
    fileCount () {
      const approved = this.attachments.filter(attachment => {
        if (attachment.status == 'approved') {
          return true
        }
      }).length

      // If all approved, return the count of all attachments. Otherwise,
      // return the count of NON-approved attachments
      if (approved == this.attachments.length) {
        return this.attachments.length
      } else {
        return this.attachments.length - approved
      }
    },
    attachments () {
      const attachments = this.getAttachmentsByEntityId({
        entityId: this.entity.dashboard_entity_id,
        dashboardId: this.dashboard.id })
      return attachments
    },
    closeOnClick() {
      // Don't close unless there is no confirm dialog open
      if (this.dialog == false) {
        return true
      }
      return false
    }
  },
  methods: {
    ...mapDashboardActions({
      updateAttachment: UPDATE_ATTACHMENT
    }),
    getViewColor (item) {
      if (item.status == 'new' || item.status == '') {
        return 'red'
      } else {
        return 'green'
      }
    },
    getApproveColor (item) {
      if (item.status == 'approved') {
        return 'green'
      } else {
        return 'red'
      }
    },
    onClickView (item) {
      // If there is one file, then open the file, if there is more than one, open selector
      item.status = 'read'
      this.updateAttachment({
        attachment: item
      }).then(() => {
        const pdf = '/openemr/controller.php?document&retrieve&patient_id=' +
          item.pid +
          '&document_id=' +
          item.metaValue;
        window.open(pdf);
      })
    },
    onClickConfirm()
    {
      if (this.action == 'delete') {
        this.activeItem.status = 'denied';
      } else if (this.action == 'approve') {
        this.activeItem.status = 'approved';
      }

      this.updateAttachment({
        attachment: this.activeItem
      }).then(() => {
        // TODO update the something?
      })
      this.dialog = false
    },
    onClickCancel () {
      this.dialog = false
    },
    onClickApprove (item)
    {
      // TODO implement approve file and send to NS
      // If the item is approved, do nothing. We would disable the button, but that turns it gray and
      // we want it green
      if (item.status == 'approved') {
        return item
      }
      this.activeItem = item
      this.action = 'approve'
      this.confirmText = "I have reviewed the file and ready to transmit to Next Step"
      this.confirmTitle = "Confirm Approval"
      this.confirmColor = "green darken-1"
      this.dialog = true
      return item
    },
    onClickDelete (item)
    {
      // TODO implement approve file and remove from Document tree
      this.activeItem = item
      this.action = 'delete'
      this.confirmText = "I have reviewed the file and confirmed it is invalid and wish to delete"
      this.confirmTitle = "Confirm Delete"
      this.confirmColor = "red darken-1"
      this.dialog = true
      return item
    }
  }
}
</script>

<style scoped>

.v-list-item__icon {
  margin-left: 16px;
}

</style>
