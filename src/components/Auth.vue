<template>
  <div>
    <div>
      <div v-if="!loggedIn">
        <v-btn flat :href="this.authURL" :loading="loginning" @click.capture="onLoginRequest">
          <span class="mr-2">SIGN IN</span>
        </v-btn>
      </div>
      <div v-else>
        <v-menu offset-y bottom left origin="center center" transition="scale-transition">
          <template v-slot:activator="{ on }">
            <!-- <v-btn fab ma-4 v-on="on"> -->
            <v-avatar>
              <v-img
                v-on="on"
                style="cursor: pointer"
                v-if="!fetchingUser"
                :src="user.image?(hotelApiImageUrl+user.image):require('../assets/images/default-user.png')"
              ></v-img>
            </v-avatar>
            <!-- </v-btn> -->
          </template>

          <v-list>
            <v-list-tile to="/dashboard">
              <v-list-tile-title>Dashboard</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="signOut">
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>


<script>
import { authURL, hotelApiImageUrl } from "../config/config.js";
import { mapGetters, mapActions } from "vuex";
import { CustomService } from "../services/storage.service";
export default {
  data() {
    return {
      authURL: authURL,
      hotelApiImageUrl: hotelApiImageUrl
    };
  },

  computed: {
    ...mapGetters("auth", ["loginning", "loggedIn", "user", "fetchingUser"])
  },

  methods: {
    ...mapActions("auth", ["login", "logout", "savePathBack"]),
    onLoginRequest() {
      CustomService.savePathBack(this.$route.path);
    },
    signOut() {
      this.logout();
      this.$router.go(this.$route);
    }
  },
  mounted() {
    if (this.$route.query.code != null) {
      this.login(this.$route.query.code);
      this.$router.replace(CustomService.getPathBack());
      CustomService.removePathBack();
    }
  }
};
</script>
