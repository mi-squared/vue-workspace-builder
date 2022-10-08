<template>
  <div class="editable-string-component relative-container">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      max-width="400px"
      min-width="320px"
      attach
    >
      <template v-slot:activator="{ on, attrs }">
        <span
          class="editable-string"
          v-bind="attrs"
          v-on="on"
        >
          <span v-if="entity[index]">
            {{ entity[index] }}
          </span>
          <span class="mb-0" v-else>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </span>

      </template>

      <v-card>
        <v-card-text>
          <v-text-field
            dense
            v-model="myString"
            class="mt-4"
            autofocus
          >
            <v-icon slot="prepend-inner" small>mdi-notepad</v-icon>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="onSave"
                class="btn-sm"
                icon
                color="primary"
                v-bind="attrs"
                v-on="on"
              ><v-icon>mdi-check-bold</v-icon></v-btn>
            </template>
            <!-- button tooltip -->
            <span>Save</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="onClear"
                class="btn-sm"
                icon
                v-bind="attrs"
                v-on="on"
              ><v-icon>mdi-cancel</v-icon></v-btn>
            </template>
            <!-- button tooltip -->
            <span>Clear</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="onClose"
                class="btn-sm"
                icon
                v-bind="attrs"
                v-on="on"
              ><v-icon>mdi-close</v-icon></v-btn>
            </template>
            <!-- button tooltip -->
            <span>Cancel</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>

    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'EditableString',
  props: {
    entity: {
      required: true
    },
    index: {
      required: true
    }
  },
  data() {
    return {
      menu: false,
      myString: ''
    }
  },
  watch: {
    menu: function () {
      if (this.menu === true) {
        this.$emit("show", true)
      } else {
        this.$emit("show", false)
      }
    }
  },
  methods: {
    onSave() {
      this.entity[this.index] = this.myString
      this.$emit('save', {
        entity: this.entity,
        fieldKey: this.index
      })
      this.menu = false
    },
    onClear() {
      this.myString = null
    },
    onClose () {
      this.myString = this.entity[this.index]
      this.menu = false
    }
  },
  mounted () {
    this.myString = this.entity[this.index]
  }
}
</script>

<style scoped>
.editable-string {
  text-decoration-line: underline;
  text-decoration-style: dashed;
  text-decoration-color: blue;
}
</style>
