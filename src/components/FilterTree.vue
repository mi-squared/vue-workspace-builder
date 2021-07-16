<template>
  <div>
    <v-treeview
        v-model="tree"
        :items="filters"
        item-key="name"
        open-all

    >

      <template v-slot:label="{ item }">

        <v-btn
            v-if="item.type == 'rule'"
            icon
            color="pink"
        >
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>

      </template>

      <template v-slot:prepend="{ item }">

        <v-btn-toggle
            v-if="item.type == 'any' || item.type == 'all'"
            v-model="item.isAny"
            mandatory
        >
          <v-btn @click.prevent="clickAnd">
            <v-icon>mdi-gate-and</v-icon> Any
          </v-btn>
          <v-btn @click.prevent="clickOr">
            <v-icon>mdi-gate-or</v-icon> All
          </v-btn>
        </v-btn-toggle>


        <v-form v-else>
          <v-container>
            <v-row>
              <v-col
                  cols="12"
                  md="4"
              >
                <v-text-field
                    v-model="item.expression"
                    :rules="nameRules"
                    :counter="10"
                    label="Field"
                    required
                ></v-text-field>
              </v-col>

              <v-col
                  cols="12"
                  md="4"
              >
                <v-select
                    :items="operators"
                    v-model="item.operator"
                    label="Operator"
                    required
                ></v-select>
              </v-col>

              <v-col
                  cols="12"
                  md="4"
              >
                <v-text-field
                    v-model="item.value"
                    label="Value"
                    required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

      </template>

      <template v-slot:append="{ item }">
        <v-btn
            v-if="item.type == 'any' || item.type == 'all'"
            >Add Rule
        </v-btn>
        <v-btn
            v-if="item.type == 'any' || item.type == 'all'"
            >Add Group
        </v-btn>
      </template>

    </v-treeview>
  </div>
</template>

<script>
export default {
  name: "FilterTree",
  data: () => ({
    isAny: true,
    operators: ['<', '>', '=', '!='],
    groups: [],
    rules: [],
    initiallyOpen: ['public'],
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-code-json',
      md: 'mdi-language-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel',
    },
    tree: [],
    filters: [
      {
        name: 'any',
        type: 'any',
        children: [
          {
            key: 1,
            type: 'rule',
            expression: 'status',
            operator: '=',
            value: 'new'
          },
          {
            key: 2,
            name: 'favicon.ico',
            file: 'png',
          },
          {
            key: 3,
            name: 'index.html',
            file: 'html',
          },
        ],
      },
    ],
  }),
  methods: {
    isLast (item) {
      if (this.items[0].children[this.items[0].children.length - 1].key == item.key) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>

</style>