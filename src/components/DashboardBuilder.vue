<template>
  <v-row>
    <v-col
        cols="12"
        sm="4"
        >
      <v-card flat>
          <v-list>
            <v-subheader>Dashboard Columns</v-subheader>

              <v-list-item-group
                  color="primary"
              >
                <draggable
                    id="first"
                    :list="list"
                    draggable=".v-list-item"
                    group="a"
                >
                <v-list-item
                    v-for="element in list"
                    :key="element.name"
                    color="primary"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-drag-vertical</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="element.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                </draggable>

              </v-list-item-group>

<!--            <v-list-item>-->
<!--              <v-btn @click="add">Add</v-btn>-->
<!--              <v-btn @click="replace">Replace</v-btn>-->
<!--            </v-list-item>-->
        </v-list>
      </v-card>

    </v-col>

    <v-col
        cols="12"
        sm="4"
        >
      <v-card flat>
        <v-list>
          <v-subheader>Available Columns</v-subheader>

          <v-list-item-group
              color="primary"
          >
            <draggable
                id="second"
                :list="list2"
                draggable=".v-list-item"
                group="a"
            >
              <v-list-item
                  v-for="element in list2"
                  :key="element.name"
                  color="primary"
              >
                <v-list-item-icon>
                  <v-icon>mdi-drag-vertical</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="element.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </draggable>

          </v-list-item-group>

<!--          <v-list-item>-->
<!--            <v-btn @click="add">Add</v-btn>-->
<!--            <v-btn @click="replace">Replace</v-btn>-->
<!--          </v-list-item>-->
        </v-list>
      </v-card>
    </v-col>

    <v-col
        cols="12"
        sm="4"
    >
      <v-card
          flat
          min-height="268"
          class="mt-2 p-4"
      >
        <v-card-title>Layout Properties <v-spacer></v-spacer><v-btn>Preview</v-btn></v-card-title>

        <v-card-text>
          <v-text-field
              label="Title"
              :rules="[required]"
              hide-details="auto"
              v-model="this.activeLayoutModel.title"
          ></v-text-field>
          <v-text-field label="Another input"></v-text-field>

        </v-card-text>
      </v-card>

      <v-card
          rounded="lg"
          min-height="268"
          class="mt-0 p-4"
      >

        <v-card-title>Element Properties</v-card-title>
        <v-card-text>

        </v-card-text>
      </v-card>

    </v-col>

  </v-row>
</template>

<script>
import draggable from "vuedraggable";
let id = 1;
export default {
  name: "two-list-headerslots",
  display: "Two list header slot",
  order: 14,
  components: {
    draggable
  },
    props: {
      dashboard: {
          type: Object,
          required: true
      }
    },
  data() {
    return {
      selectedItem: 1,
      list: [
        { name: "John 1", id: 0 },
        { name: "Joao 2", id: 1 },
        { name: "Jean 3", id: 2 }
      ],
      list2: [{ name: "Jonny 4", id: 3 }, { name: "Guisepe 5", id: 4 }]
    };
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan " + id, id: id++ });
    },
    replace: function() {
      this.list = [{ name: "Edgard", id: id++ }];
    },
    add2: function() {
      this.list2.push({ name: "Juan " + id, id: id++ });
    },
    replace2: function() {
      this.list2 = [{ name: "Edgard", id: id++ }];
    }
  }
};
</script>
<style scoped></style>
