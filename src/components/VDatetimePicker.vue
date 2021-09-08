<template>
  <v-edit-dialog
      :key="slot.key"
      :return-value.sync="props.item.name"
      @save="save"
      @cancel="cancel"
      @open="open"
      @close="close"
  >
  <template>
    <v-item-group>
        <v-container grid-list-md pa-0>
          <v-layout wrap>
            <v-flex xs2>
              <v-autocomplete
                  v-model="endHour"
                  :items="hours"
              >
              </v-autocomplete>
            </v-flex>
            <v-flex shrink align-self-center>
              <p class="mb-0">:</p>
            </v-flex>
            <v-flex xs2>
              <v-autocomplete v-model="endMinute" :items="hours"> </v-autocomplete>
            </v-flex>
          </v-layout>
        </v-container>
      </v-item-group>
    </template>
  </v-edit-dialog>
</template>

<script>
export default {
  name: "VDatetimePicker"
}
</script>

<style scoped>

</style>