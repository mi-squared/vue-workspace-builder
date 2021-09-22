import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";

// Import our Vuex modules
import { user } from './modules/user'
import { workspace } from './modules/workspace'
import { dashboard } from './modules/dashboard'
import { form } from './modules/form'
import { filter } from './modules/filter'
import { list } from './modules/list'

Vue.use(Vuex);

// pathify.debug()

export default new Vuex.Store({
  plugins: [pathify.plugin],
  modules: {
    user,
    workspace,
    dashboard,
    form,
    filter,
    list,
  },
  actions: {},
});
