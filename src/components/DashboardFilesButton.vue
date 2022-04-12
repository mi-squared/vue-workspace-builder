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
            :color="orange"
            overlap
          >
            <v-icon>
              mdi-attachment
            </v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in files"
          :key="index"
        >
          <v-list-item-title>
            <a @click="onClickView(item)">{{ item.title }}</a>
          </v-list-item-title>

          <v-list-item-icon>
            <v-btn icon @click="onClickView(item)">
              <v-icon>mdi-eye-arrow-right-outline</v-icon>
            </v-btn>
          </v-list-item-icon>

          <v-list-item-icon>
            <v-btn icon @click.stop="onClickApprove(item)">
              <v-icon>mdi-check-circle-outline</v-icon>
            </v-btn>
          </v-list-item-icon>

          <v-list-item-icon>
            <v-btn icon @click.stop="onClickDelete(item)">
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
      </v-list>

    </v-menu>

    <!-- Confirmation dialog -->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
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
            @click="onClickConfirm()"
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
      confirmColor: ''
    }
  },
  computed: {
    fileCount () {
      //getFilessByEntityId({ entityId: item.id, dashboardId: dashboard.id }).length
      return this.files.length
    },
    files () {
      if (this.entity.attachments != null) {
        return Object.values(this.entity.attachments)
      } else {
        return []
      }
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
    onClickView (item) {
      // If there is one file, then open the file, if there is more than one, open selector
      const pdf = '/openemr/controller.php?document&retrieve&patient_id=' +
        item.pid +
        '&document_id=' +
        item.metaValue;
      window.open(pdf);
    },
    onClickConfirm()
    {
      this.dialog = false
    },
    onClickApprove (item)
    {
      // TODO implement approve file and send to NS
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
