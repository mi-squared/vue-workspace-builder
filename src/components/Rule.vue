<template>
  <div class="form-group and-or-rule row">
    <div class="col-3">
      <v-select
          v-model="key"
          :items="options"
      ></v-select>
    </div>

    <div class="col-3">
      <v-select
          v-model="operator"
          :items="options.operators"
      ></v-select>
    </div>

    <div class="col-3">
      <v-text-field
          v-model="value"
          label="Value"
      ></v-text-field>
    </div>

    <button class="btn btn-xs btn-purple-outline btn-radius" @click.prevent="deleteSelf()">
      <i class="fa fa-fw fa-close"></i>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'rule',
    props: ['options'],
    watch: {
      'options.keys.options' () {
        this.key = -99;
      },
      'options.conditions.options' () {
        this.condition = -99;
      }
    },
    data () {
      return {
        key: -99,
        operator: -99,
        value: ''
      }
    },
    computed: {

    },
    methods: {
      deleteSelf () {
        this.$emit('delete-rule');
      },

      queryFormStatus () {
        return {
          'key': this.key,
          'operator': this.operator,
          'value': this.value
        }
      },

      fillRuleStatus (data) {
        this.key = data.key;
        this.operator = data.operator;
        this.value = data.value;
      }
    }
  }
</script>

<style>
  .and-or-rule {
    position: relative;
    height: 30px;
    margin-left: 15px !important;
    padding-left: 0;
  }

  .and-or-rule:before,
  .and-or-rule:after {
    content: '';
    position: absolute;
    left: -1px;
    width: 16px;
    height: calc(50% + 16px);
    border-color: #c0c5e2;
    border-style: solid;
  }

  .and-or-rule:before {
    top: -16px;
    border-width: 0 0 2px 2px;
  }

  .and-or-rule:after {
    top: 50%;
    border-width: 0 0 0 2px;
  }

  .and-or-rule:last-child:after {
    border: none;
  }
</style>
