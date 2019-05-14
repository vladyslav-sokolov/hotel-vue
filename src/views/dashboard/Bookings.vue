<template>
  <div>
    <v-container>
      <v-layout justify-center column fill-height my-5>
        <div v-if="fetchingBookings">
          <v-container my-5>
            <v-layout my-5 justify-center>
              <div v-if="networkError">
                <NetworkError></NetworkError>
              </div>
              <div v-else>
                <v-progress-circular :size="50" color="black" indeterminate></v-progress-circular>
              </div>
            </v-layout>
          </v-container>
        </div>
        <div v-else>
          <div v-if="bookings && isAdmin">
            <v-data-table :headers="headers" :items="bookings" class="elevation-1" v-if="bookings">
              <template v-slot:items="props">
                <td>{{ props.item.id }}</td>
                <td class="text-xs-left">{{ props.item.dateFrom.substr(0, 10) }}</td>
                <td class="text-xs-left">{{ props.item.dateTo.substr(0, 10)}}</td>
                <td class="text-xs-left">{{ props.item.room.number}}</td>
                <td class="text-xs-left">{{ props.item.room.roomType.code}}</td>
                <td class="text-xs-left">{{ props.item.manager? props.item.manager.username:null}}</td>
                <td class="text-xs-left">{{ props.item.guest? props.item.guest.username:null}}</td>
              </template>
            </v-data-table>
          </div>
          <div v-if="bookings && !isAdmin">
            <div v-if="bookings.length === 0">
              <v-container grid-list-xl>
                <v-layout container column class="headline font-weight-light">
                  <p>You have maid no bookings yet.</p>
                  <p>
                    Go to
                    <router-link to="/bookings">bookings page</router-link>&nbsp;to create new one.
                  </p>
                </v-layout>
              </v-container>
            </div>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-for="b in bookings" :key="b.id">
                <template v-slot:header>
                  <div>
                    <v-layout align-start justify-space-around row fill-height wrap>
                      <v-flex xs12 sm3>
                        <div>№ "{{b.id}}"</div>
                      </v-flex>
                      <v-flex xs12 sm3>
                        <div>In: {{b.dateFrom.substr(0, 10)}}</div>
                      </v-flex>
                      <v-flex xs12 sm3>
                        <div>Out: {{b.dateTo.substr(0, 10)}}</div>
                      </v-flex>
                      <v-flex xs12 sm3>
                        <div>
                          Room
                          <sup>{{b.room.number}}</sup>/
                          <sub>{{b.room.floor}}</sub>
                        </div>
                      </v-flex>
                    </v-layout>
                  </div>
                </template>
                <v-card>
                  <v-container grid-list-md>
                    <v-layout align-start justify-space-around row fill-height wrap>
                      <v-flex xs12 sm4>
                        <v-img
                          :src="b.room.roomType.image?(hotelApiImageUrl+b.room.roomType.image):require('../../assets/images/default.png')"
                        ></v-img>
                      </v-flex>
                      <v-flex xs12 sm4>
                        <div class="headline">Room info</div>
                        <div class="my-2 subheading font-weight-light">
                          <span class="font-weight-regular">Type:&nbsp;</span>
                          <span>{{ b.room.roomType.code }}</span>
                        </div>
                        <div class="my-2 subheading font-weight-light">
                          <span class="font-weight-regular">Categories:&nbsp;</span>
                          <span>{{ b.room.roomType.categories }}</span>
                        </div>
                        <div class="my-2 subheading font-weight-light">
                          <span class="font-weight-regular">Facilities:&nbsp;</span>
                          <span>{{ b.room.roomType.facilities }}</span>
                        </div>
                        <div class="my-2 subheading font-weight-light">
                          <span class="font-weight-regular">Bed type:&nbsp;</span>
                          <span>{{ b.room.roomType.bedType }}</span>
                        </div>
                      </v-flex>
                      <v-flex xs12 sm4>
                        <div class="headline">Payment info</div>
                        <div class="my-2 subheading font-weight-light">
                          <span class="font-weight-regular">Total nights:&nbsp;</span>
                          <span>{{ (new Date(b.dateTo) - new Date(b.dateFrom))/(1000 * 3600 * 24) }}</span>
                        </div>
                        <div class="my-2 subheading font-weight-light">
                          <span class="font-weight-regular">Total price:&nbsp;</span>
                          <span
                            class="font-weight-light"
                          >{{ b.room.roomType.cost * (new Date(b.dateTo) - new Date(b.dateFrom))/(1000 * 3600 * 24) }}&nbsp;$</span>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { hotelApiImageUrl } from "../../config/config.js";
import NetworkError from "../../components/NetworkError";
export default {
  data: () => ({
    hotelApiImageUrl: hotelApiImageUrl,
    headers: [
      { text: "Booking id", align: "left", value: "id" },
      { text: "In date", value: "dateFrom" },
      { text: "Out date", value: "dateTo" },
      { text: "Room number", value: "room.number" },
      { text: "Room t-code", value: "room.roomType.code" },
      { text: "Manager", value: "manager.username" },
      { text: "Guest", value: "guest.username" }
      // { text: "Actions", value: "actions", sortable: false, align: "center" }
    ]
  }),
  components: {
    NetworkError
  },
  created() {
    if (!this.fetchingUser) {
      if (this.isAdmin) this.bookingsFetch(-1);
      else this.bookingsFetch(this.user.id);
    }
  },
  computed: {
    ...mapGetters("booking", [
      "fetchingBookings",
      "bookings",
      "errorCode",
      "errorMessage"
    ]),
    ...mapGetters("auth", ["user", "isAdmin", "fetchingUser"]),
    ...mapGetters("error", ["networkError"])
  },
  methods: {
    ...mapActions("booking", ["bookingsFetch"]),
    ...mapActions("auth", ["fetchUserDetails"])
  },
  watch: {
    fetchingUser(val) {
      if (!val) {
        if (this.isAdmin) this.bookingsFetch(-1);
        else this.bookingsFetch(this.user.id);
      }
    }
  }
};
</script>