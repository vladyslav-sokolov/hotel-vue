<template>
  <div>
    <!-- info -->
    <section>
      <v-parallax :src="require('../assets/images/bg_3.jpg')" height="600">
        <v-layout  column align-start justify-center class>
          <p class="display-1 text-uppercase font-weight-thin">Services</p>
          <p class="display-4 font-weight-thin">Facilities &amp; Services</p>
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
  </div>
</template>
    
<script>
export default {
  data() {
    return {
      services: [
        { title: "Room Service", icon: "room_service" },
        { title: "Free Wi-Fi", icon: "wifi" },
        { title: "Car Wash", icon: "local_car_wash" },
        { title: "Child Care", icon: "child_care" },
        { title: "Swimming Pool", icon: "pool" },
        { title: "Restaurant", icon: "restaurant" },
        { title: "Fitness Center", icon: "fitness_center" },
        { title: "Spa", icon: "spa" }
      ]
    };
  }
};
</script>
    