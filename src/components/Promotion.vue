<template>
  <div v-if="!expired">
    <v-parallax :src="image" height="220">
      <v-container grid-list-md>
        <v-layout align-center justify-center row fill-height>
          <v-flex xs8>
            <p class="display-1 font-weight-light">{{title}}</p>
            <v-btn outline class="font-weight-light" to="/bookings" dark large>Book now</v-btn>
          </v-flex>

          <v-flex xs4>
            <p class="subheading text-uppercase font-weight-thin">
              <span v-if="!inProgress">{{endMessage}}</span>
              <span v-else>{{startMessage}}</span>
            </p>
            <div>
              <span class="font-weight-regular headline gray ml-1">{{ timer_left.days }}&nbsp;</span>
              <span class="font-weight-thin subheading">days &nbsp;</span>
              <span class="font-weight-regular headline gray">{{ timer_left.hours }}&nbsp;</span>
              <span class="font-weight-thin subheading">hours &nbsp;</span>
              <span class="font-weight-regular headline gray">{{ timer_left.mins }}&nbsp;</span>
              <span class="font-weight-thin subheading">mins &nbsp;</span>
              <span class="font-weight-regular headline gray">{{ timer_left.secs }}&nbsp;</span>
              <span class="font-weight-thin subheading">secs &nbsp;</span>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-parallax>
  </div>
</template>

<script>
export default {
  name: "Promotion",
  props: {
    start_date: String,
    end_date: String,
    title: String,
    image: String
  },
  data() {
    return {
      startMessage: "The promo will end in",
      endMessage: "The promo will start in",
      expired: false,
      inProgress: false,
      timer: null,
      timer_left: {
        days: null,
        hours: null,
        mins: null,
        secs: null
      }
    };
  },
  mounted() {
    this.recalcTime(); // set time without waiting 1sec
    this.startTimer();
  },
  destroyed() {
    this.stopTimer();
  },
  methods: {
    startTimer() {
      this.timer = setInterval(this.recalcTime, 1000);
    },
    stopTimer() {
      clearTimeout(this.timer);
    },
    recalcTime() {
      let t = new Date(this.start_date).getTime() - new Date().getTime();
      if (t < 0) {
        t = new Date(this.end_date).getTime() - new Date().getTime();
        if (t < 0) {
          this.stopTimer();
          this.expired = true;
          return;
        } else {
          this.inProgress = true;
        }
      }
      this.timer_left.days = Math.floor(t / (1000 * 60 * 60 * 24));
      this.timer_left.hours = Math.floor(
        (t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.timer_left.mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      this.timer_left.secs = Math.floor((t % (1000 * 60)) / 1000);
    }
  }
};
</script>
