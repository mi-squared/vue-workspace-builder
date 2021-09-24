<template>
  <div>

    <v-row>
      <v-col>
        <v-select
          :items="unitOptions" label="Units"
          :value="model.units"
          :v-model="model.units"
          @change="unitsChanged"></v-select>
      </v-col>
    </v-row>
    <v-row v-for="range in model.ranges" :key="range.order">
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
        Greater than or equal to {{ pickerMax }} {{ model.units }} =
        <v-icon
          :color="model.outOfRangeColor">
          mdi-format-color-fill
        </v-icon>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'MultiRangePicker',
  props: {
    ranges: {
      type: Array,
      required: true
    },
    outOfRangeColor: {
      type: String,
      required: false,
    },
    units: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      colorDialogs: {},
      selectedRange: null,
      unitOptions: [
        'minutes', 'hours', 'days'
      ],
      model: {
        ranges: this.ranges || [],
        outOfRangeColor: this.outOfRangeColor || 'grey',
        units: this.units || 'minutes'
      }

    }
  },
  computed: {
    pickerMax() {
      let max = 0
      this.model.ranges.forEach(range => {
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
      for ( let i = range.order; i < this.model.ranges.length - 1; ++i) {
        let thisRange = this.model.ranges[i]
        let nextRange = this.model.ranges[i + 1]
        this.$set(thisRange.range, 1, range.range[1])
        this.$set(nextRange.range, 0, range.range[1] + 1)
      }

      this.$emit('change', this.model)
    },
    unitsChanged(units) {
      this.$set(this.model, 'units', units)
      this.$emit('change', this.model)
    },
    addRange() {
      const order = this.model.ranges.length;
      const start = this.model.ranges.length ? this.model.ranges[this.model.ranges.length - 1].range[1] : 0
      const end = start + 30
      const range = {
        order: order,
        range: [
          start === 0 ? 0 : start + 1,
          end
        ],
        color: 'red'
      }
      this.model.ranges.push(range)
      this.$emit('multi-range-picker-changed', this.model)
    },
    minValueForRange(range) {
      // Range's minis the max of the previous range in order
      if (range.order === 0) {
        return 0
      } else {
        return this.model.ranges[range.order - 1].range[1]
      }
    },
    getLengthForRange(range) {
      return range.range[1] - range.range[0]
    }
  },
  mounted () {
    console.log("MultiRangePicker Mounted")
  }
}
</script>

<style scoped>

</style>
