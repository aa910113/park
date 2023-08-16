import { createStore } from 'vuex';

export default createStore({
  state: {
    parkPosition: { lat: 25.0442, lng: 121.52332 },
  },
  getters: {},
  mutations: {
    setParkPosition(state, coordinate) {
      state.parkPosition = coordinate;
    },
  },
  actions: {},
  modules: {},
});
