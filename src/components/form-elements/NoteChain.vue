<template>
  <v-list three-line>
    <template v-for="item in notes">
      <v-list-item
        :key="item.title"
      >
        <v-list-item-content>
          <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
          <v-list-item-title v-html="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
export default {
  name: 'NoteChain',
  data() {
    return {
      notes: [],


    }
  }
}
</script>

<style scoped>

</style>
