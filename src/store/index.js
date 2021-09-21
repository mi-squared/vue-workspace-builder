import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";
// Import our Vuex modules
import { dashboard } from './modules/dashboard'
import { workspace } from './modules/workspace'
import { user } from './modules/user'

Vue.use(Vuex);

// pathify.debug()

export default new Vuex.Store({
  plugins: [pathify.plugin],
  modules: {
    user,
    workspace,
    dashboard,
  },
});
