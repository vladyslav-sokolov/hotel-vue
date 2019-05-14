<template>
  <div>
    <!-- info -->
    <section>
      <v-parallax :src="require('../assets/images/bg_2.jpg')" height="600">
        <v-layout  column align-start justify-center class>
          <p class="display-1 text-uppercase font-weight-thin">Rooms</p>
          <p class="display-4 font-weight-thin">Rooms &amp; Suites</p>
          <v-btn outline class="font-weight-light" dark to="/bookings">Book now</v-btn>
        </v-layout>
      </v-parallax>
    </section>

    <section class="container my-5">
      <v-flex xs12 sm6>
        <p class="headline text-uppercase font-weight-thin">Featured rooms</p>
        <p class="display-2 font-weight-thin">Rooms &amp; Suites</p>
      </v-flex>
    </section>

    <div v-if="getting">
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
      <v-container grid-list-xl>
        <v-layout wrap>
          <v-flex md12 sm12 lg4 v-for="room in roomTypes" :key="room.id">
            <v-card>
              <router-link :to="{ name: 'bookings', params: { roomTypeId: room.id }}">
                <v-img aspect-ratio="2"
                  :src="room.image?(hotelApiImageUrl+room.image):require('../assets/images/default.png')"
                ></v-img>
              </router-link>
              <v-card-title primary-title>
                <div>
                  <div class="headline font-weight-regular">{{room.code}}</div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">
                      <sup>$</sup>
                      <span class="font-weight-regular display-1">{{ room.cost }}</span> / per night
                    </span>
                  </div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">Categories:&nbsp;</span>
                    <span class="font-weight-light">{{ room.categories }}</span>
                  </div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">Facilities:&nbsp;</span>
                    <span class="font-weight-light">{{ room.facilities }}</span>
                  </div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">Size:</span>
                    <span class="font-weight-light">
                      {{ room.size }} m
                      <sup>2</sup>
                    </span>
                  </div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">Bed Type:&nbsp;</span>
                    <span class="font-weight-light">{{ room.bedType }}</span>
                  </div>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>
    
<script>
import { hotelApiImageUrl } from "../config/config";
import { mapGetters, mapActions } from "vuex";
import NetworkError from "../components/NetworkError";
export default {
  components: {
    NetworkError
  },
  data() {
    return {
      hotelApiImageUrl: hotelApiImageUrl
    };
  },
  created() {
    this.fetchRoomTypes();
  },

  computed: {
    ...mapGetters("roomType", ["roomTypes", "getting"]),
    ...mapGetters("error", ["networkError"])
  },

  methods: {
    ...mapActions("roomType", ["fetchRoomTypes"])
  }
};
</script>
    