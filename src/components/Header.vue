<template>
  <div>
    <v-navigation-drawer clipped fixed v-model="drawer" app v-if="loggedIn || $vuetify.breakpoint.smAndDown">
      <v-list class="hidden-md-and-up">
        <v-list-tile v-for="item in menu" :key="item.title" :to="item.to">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile v-for="item in items" :key="item.title" :to="item.to">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app fixed clipped-left height="50">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="loggedIn || $vuetify.breakpoint.smAndDown"></v-toolbar-side-icon>
      <v-toolbar-title>
        <v-list-tile active-class to="/">SweefLand</v-list-tile>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-for="item in menu" :key="item.title" :to="item.to" flat>{{ item.title }}</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>

      <Auth></Auth>
    </v-toolbar>
  </div>
</template>
<script>
import Auth from "../components/Auth";
import { mapGetters } from "vuex";
export default {
  components: {
    Auth
  },
  computed: {
    ...mapGetters("auth", ["loggedIn", "isAdmin", "fetchingUser"])
  },
  data() {
    return {
      drawer: null,
      items: [],
      menu: [
        { icon: "home", to: "/", title: "Home" },
        { icon: "domain", to: "/rooms", title: "Rooms" },
        { icon: "payment", to: "/bookings", title: "Bookings" },
        { icon: "beach_access", to: "/services", title: "Services" },
        { icon: "public", to: "/about", title: "About" }
      ]
    };
  },
  created() {},
  watch: {
    fetchingUser(val) {
      if (!val) {
        if (this.isAdmin) {
          this.items = [
            { title: "Dashboard", icon: "dashboard", to: "/dashboard" },
            {
              title: "Room types",
              icon: "domain",
              to: "/dashboard/room-types"
            },
            { title: "Rooms", icon: "meeting_room", to: "/dashboard/rooms" },
            { title: "Bookings", icon: "payment", to: "/dashboard/bookings" }
          ];
        } else {
          this.items = [
            { title: "Dashboard", icon: "dashboard", to: "/dashboard" },
            { title: "Bookings", icon: "payment", to: "/dashboard/bookings" }
          ];
        }
      }
    }
  }
};
</script>
