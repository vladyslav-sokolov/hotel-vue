<template>
  <div>
    <!-- info -->
    <section>
      <v-parallax :src="require('../assets/images/bg_4.jpg')" height="600">
        <v-layout column align-start justify-center class>
          <p class="display-1 text-uppercase font-weight-thin">About</p>
          <p class="display-4 font-weight-thin">The Hotel</p>
          <v-btn outline class="font-weight-light" dark large to="/bookings">Book now</v-btn>
        </v-layout>
      </v-parallax>
    </section>

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
export default {};
</script>
    