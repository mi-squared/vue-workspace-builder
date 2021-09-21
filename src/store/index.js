import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";

// Import our Vuex modules
import { user } from './modules/user'
import { workspace } from './modules/workspace'
import { dashboard } from './modules/dashboard'
import { form } from './modules/form'

import axios from 'axios'

Vue.use(Vuex);

// pathify.debug()

export default new Vuex.Store({
  plugins: [pathify.plugin],
  modules: {
    user,
    workspace,
    dashboard,
    form,
  },
  actions: {
    /**
     * This is the API init call that is required for subsequent calls to the API
     *
     * @param state
     * @param commit
     * @returns {Promise<unknown>}
     */
    init({ state, commit }) {
      return new Promise((resolve) => {
        axios
          .get("/interface/modules/custom_modules/oe-workspace-server/init.php")
          .then(function(response) {
            const metaData = response.data;
            commit("setMetaData", metaData);
            resolve(state.metaData);
          });
      });
    },

  }
});
