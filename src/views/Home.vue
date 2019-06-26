<template>
  <div>
    <!-- info -->
    <section>
      <v-parallax :src="require('../assets/images/bg_1.jpg')" height="600">
        <v-layout  column align-start justify-center>
          <p class="display-1 text-uppercase font-weight-thin">Welcome</p>
          <p class="display-4 font-weight-thin">Simple &amp; Elegant</p>
          <v-btn outline class="font-weight-light" dark large to="/bookings">Book now</v-btn>
        </v-layout>
      </v-parallax>
    </section>

    <!-- services -->
    <section class="my-5">
      <v-layout column wrap container align-start>
        <v-flex xs12 sm4 class>
          <p class="headline text-uppercase font-weight-thin">Services</p>
          <p class="display-2 font-weight-thin">Facilities &amp; Services</p>
        </v-flex>
        <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
            <v-flex v-for="service in services" :key="service.title" xs3>
              <v-card-text class="px-0">
                <v-icon x-large color="black darken-2">{{service.icon}}</v-icon>
                <p>{{service.title}}</p>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </section>

    <!-- rooms -->
    <section class="my-5">
      <div class="container">
        <v-flex xs12 sm4 class>
          <p class="headline text-uppercase font-weight-thin">Featured rooms</p>
          <p class="display-2 font-weight-thin">Rooms &amp; Suites</p>
        </v-flex>
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
          <carousel
            :margin="30"
            :nav="false"
            :autoplay="false"
            :loop="false"
            :dots="false"
            :responsive="{0:{items:1},600:{items:2},960:{items:3}}"
          >
            <v-card class="my-5  mx-auto" v-for="room in roomTypes" :key="room.id" >
              <router-link :to="{ name: 'bookings', params: { roomTypeId: room.id }}">
                <v-img aspect-ratio="2"
                  :src="room.image?(hotelApiImageUrl+room.image):require('../assets/images/default.png')"
                ></v-img>
              </router-link>
              <v-card-title primary-title>
                <div class="text-truncate">
                  <div class="headline font-weight-regular">{{room.code}}</div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">
                      <sup>$</sup>
                      <span class="font-weight-regular display-1">{{ room.cost }}</span> / per night
                    </span>
                  </div>
                  <div class="my-2 subheading font-weight-light text-truncate">
                    <span class="font-weight-regular">Categories:&nbsp;</span>
                    <span class="font-weight-light ">{{ room.categories }}</span>
                  </div>
                  <div class="my-2 subheading font-weight-light text-truncate">
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
                  <div class="my-2 subheading font-weight-light text-truncate">
                    <span class="font-weight-regular">Bed Type:&nbsp;</span>
                    <span class="font-weight-light ">{{ room.bedType }}</span>
                  </div>
                </div>
              </v-card-title>
            </v-card>
          </carousel>
        </div>
      </div>
    </section>

    <!-- promos -->
    <section>
      <div v-for="promo in promos" :key="promo.start_date" class="my-5">
        <Promotion
          :start_date="promo.start_date"
          :end_date="promo.end_date"
          :title="promo.title"
          :image="promo.image"
        />
      </div>
    </section>

    <!-- additional info -->
    <section>
      <v-layout row wrap justify-center class="my-5">
        <v-flex xs12 sm4>
          <v-card class="elevation-0 transparent">
            <v-card-title primary-title class="layout justify-center">
              <div class="headline">Hotel info</div>
            </v-card-title>
            <v-card-text>
              <p>SweetLand Hotel was built in 1974, and since then, it has been offering the best in order to obtain the maximum level of customer satisfaction, which is the company’s pillar.</p>
              <p>To achieve this, we have an excellent team of professionals who are qualified and committed to ensuring that customers have a great experience during their stay, whether for business or while on vacation. On top of that, we also have a strategic location that is very well connected with the entire city.</p>
              <p>Following four decades of experience in the sector, the SweetLand Hotel makes a continuous effort to improve the quality of its products and services every day.</p>
              <p>SweetLand Hotel – we take care of the details!</p>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm4 offset-sm1>
          <v-card class="elevation-0 transparent">
            <v-card-title primary-title class="layout justify-center">
              <div class="headline">Contact us</div>
            </v-card-title>
            <v-card-text>Contact information:</v-card-text>
            <v-list class="transparent">
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon class="black--text text--lighten-2">phone</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>777-867-5309</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon class="black--text text--lighten-2">place</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Austin, TX</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon class="black--text text--lighten-2">email</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>sweetland_hotel@gmail.com</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </section>
  </div>
</template>

<script>
import Promotion from "../components/Promotion";
import carousel from "vue-owl-carousel";
import { hotelApiImageUrl } from "../config/config";
import { mapGetters, mapActions } from "vuex";
import NetworkError from "../components/NetworkError";
export default {
  components: {
    Promotion,
    carousel,
    NetworkError
  },

  data: () => ({
    hotelApiImageUrl: hotelApiImageUrl,
    services: [
      { title: "Room Service", icon: "room_service" },
      { title: "Free Wi-Fi", icon: "wifi" },
      { title: "Car Wash", icon: "local_car_wash" },
      { title: "Child Care", icon: "child_care" },
      { title: "Swimming Pool", icon: "pool" },
      { title: "Restaurant", icon: "restaurant" },
      { title: "Fitness Center", icon: "fitness_center" },
      { title: "Spa", icon: "spa" }
    ],
    promos: [
      {
        start_date: "Jun 10, 2019",
        end_date: "Sep 5, 2019",
        title: "June promo 10% off",
        image: require("../assets/images/promo_2.jpg")
      }
    ]
  }),

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
<style>
</style>