<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="400px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <span
        class="text-decoration-underline"
        v-bind="attrs"
        v-on="on"
      >
        <span v-if="entity[index]">
          {{ entity[index] }}
        </span>
        <v-icon v-else>mdi-note-plus-outline</v-icon>
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
        <v-btn color="grey lighten-1" text @click="menu = false">Clear</v-btn>
        <v-btn color="green darken-1" text @click="onSave">Save</v-btn>
      </v-card-actions>
    </v-card>

  </v-menu>
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
      menu: false
    }
  },
  computed: {
    myString: {
      get: function () {
        return this.entity[this.index]
      },
      // setter
      set: function (newValue) {
        this.entity[this.index] = newValue
      }
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
      this.$emit('save', this.entity)
      this.menu = false
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
