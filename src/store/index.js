import Vue from 'vue';
import Vuex from 'vuex';

import { auth } from './auth.module';
import { roomType } from './roomType.module'
import { room } from './room.module'
import { booking } from './booking.module'
import { error } from './error.module'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    roomType,
    room,
    booking,
    error
  },
});