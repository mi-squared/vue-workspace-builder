<template>
  <div>

    <v-row>
      <v-col>
        <v-select :items="unitOptions" label="Units"></v-select>
      </v-col>
    </v-row>
    <v-row v-for="range in picker.ranges" :key="range.order">
      <v-col cols="2">
        <v-text-field
          label="Min"
          v-model.number="range.range[0]"
          class="mt-0 pt-0"
          hide-details
          single-line
          disabled
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          label="Max"
          v-model.number="range.range[1]"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          @change="updateRangeMax(range)"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-dialog
          v-model="colorDialogs[range.order]"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              :color="range.color"
              v-bind="attrs"
              v-on="on">
              mdi-format-color-fill
            </v-icon>

          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Select Color
            </v-card-title>

            <v-card-text>
              <v-color-picker
                v-model="range.color"
                class="ma-2"
                dot-size="31"
                hide-inputs
                show-swatches
                swatches-max-height="200"
              ></v-color-picker>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="colorDialogs[range.order] = false"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
      <v-col>

        <v-range-slider
          :value="range.range"
          :min="`0`"
          :max="pickerMax"
          :color="range.color"
          :track-color="`grey`"
          :thumb-color="range.color"
          thumb-label="always"
          readonly
        ></v-range-slider>

      </v-col>

    </v-row>
    <v-row>
      <v-col>
        <v-btn
          outlined
          right
          @click="addRange"
        >
        + Add Range
        </v-btn>
      </v-col>
      <v-col>
        Greater than or equal to {{ pickerMax }} {{ picker.units }} =
        <v-icon
          :color="picker.outOfRangeColor">
          mdi-format-color-fill
        </v-icon>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'MultiRangePicker',
  data() {
    return {
      colorDialogs: {},
      selectedRange: null,
      unitOptions: [
        'Minutes', 'Hours', 'Days'
      ],
      picker: {
        outOfRangeColor: 'grey',
        units: 'minutes',
        ranges: [

        ]
      }
    }
  },
  computed: {
    pickerMax() {
      let max = 0
      this.picker.ranges.forEach(range => {
        max = range.range[1]
      })
      return max
    },
  },
  methods: {
    updateRangeMax(range) {
      // If this is not the last range, we need to set the min of the next one to ONE GREATER
      // when we update the max of this one
      console.log(range)
      for ( let i = range.order; i < this.picker.ranges.length - 1; ++i) {
        let thisRange = this.picker.ranges[i]
        let nextRange = this.picker.ranges[i + 1]
        this.$set(thisRange.range, 1, range.range[1])
        this.$set(nextRange.range, 0, range.range[1] + 1)
      }
    },
    addRange() {
      const order = this.picker.ranges.length;
      const start = this.picker.ranges.length ? this.picker.ranges[this.picker.ranges.length - 1].range[1] : 0
      const end = start + 30
      const range = {
        order: order,
        range: [
          start === 0 ? 0 : start + 1,
          end
        ],
        color: 'red'
      }
      this.picker.ranges.push(range)
    },
    minValueForRange(range) {
      // Range's minis the max of the previous range in order
      if (range.order === 0) {
        return 0
      } else {
        return this.picker.ranges[range.order - 1].range[1]
      }
    },
    getLengthForRange(range) {
      return range.range[1] - range.range[0]
    }
  }
}
</script>

<style scoped>

</style>
