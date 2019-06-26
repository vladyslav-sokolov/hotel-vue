<template>
  <div>
    <!-- info -->
    <section>
      <v-parallax :src="require('../assets/images/bg_5.jpg')" height="600">
        <v-layout column align-start justify-center>
          <p class="display-1 text-uppercase font-weight-thin">Welcome</p>
          <p class="display-4 font-weight-thin">Simple &amp; Elegant</p>
        </v-layout>
      </v-parallax>
    </section>

    <!-- booking -->
    <section>
      <v-container>
        <v-card>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md3>
                <v-menu
                  v-model="inDatePicker"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="inDate"
                      label="In date"
                      prepend-icon="event"
                      readonly
                      :disabled="fetching || getting"
                      :loading="fetching || getting"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :allowed-dates="allowedInDate"
                    v-model="inDate"
                    @input="inDatePicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-menu
                  v-model="outDatePicker"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="outDate"
                      label="Out date"
                      prepend-icon="event"
                      readonly
                      :disabled="fetching || getting"
                      :loading="fetching || getting"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="outDate"
                    :allowed-dates="allowedOutDate"
                    @input="outDatePicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-select
                  :loading="fetching || getting"
                  v-model="selectedRoomType"
                  :items="roomTypes"
                  :disabled="fetching || getting"
                  item-text="code"
                  label="Room type"
                  persistent-hint
                  return-object
                  single-line
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md2>
                <v-layout justify-center>
                  <v-btn
                    :loading="fetching"
                    :disabled="fetching || getting"
                    outline
                    large
                    @click="check"
                  >Check</v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-container>
    </section>

    <!-- selected room type -->
    <section id="roomType">
      <v-container v-if="selectedRoomType">
        <v-card>
          <v-card-title primary-title>
            <v-container grid-list-xl>
              <v-layout align-start justify-start row wrap>
                <v-flex xs12 md4>
                  <v-img :src="imageUrl"></v-img>
                </v-flex>
                <v-flex xs12 md8>
                  <div class="headline font-weight-regular">{{selectedRoomType.code}}</div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">
                      <sup>$</sup>
                      <span class="font-weight-regular headline">{{ selectedRoomType.cost }}</span> / per night
                    </span>
                  </div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">Categories:</span>
                    <span class="font-weight-light">{{ selectedRoomType.categories }}</span>
                  </div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">Facilities:</span>
                    <span class="font-weight-light">{{ selectedRoomType.facilities }}</span>
                  </div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">Size:</span>
                    <span class="font-weight-light">
                      {{ selectedRoomType.size }} m
                      <sup>2</sup>
                    </span>
                  </div>
                  <div class="my-2 subheading font-weight-light">
                    <span class="font-weight-regular">Bed Type:</span>
                    <span class="font-weight-light">{{ selectedRoomType.bedType }}</span>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-title>
        </v-card>
      </v-container>
    </section>

    <!-- available rooms -->
    <section id="rooms">
      <v-container>
        <div v-if="networkError">
          <v-layout justify-center>
            <NetworkError></NetworkError>
          </v-layout>
        </div>
        <div v-else>
          <v-stepper v-model="bookingStepper" v-if="showAvailableRooms">
            <v-stepper-header>
              <v-stepper-step :complete="bookingStepper > 1" step="1">Select room</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="bookingStepper > 2" step="2">Your credentials</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="bookingStepper > 3" step="3">Confirm</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="4">Booking status</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <div v-if="rooms.length === 0 && !fetching">
                  <v-container grid-list-xl>
                    <v-layout container column class="headline font-weight-light">
                      <p>No rooms of "{{selectedRoomType.code}}" in "{{inDate}}"-"{{outDate}}" available.</p>
                      <p>Please select another room type or date.</p>
                    </v-layout>
                  </v-container>
                </div>
                <div v-if="fetching">
                  <v-container my-5>
                    <v-layout my-5 justify-center>
                      <v-progress-circular :size="50" color="black" indeterminate></v-progress-circular>
                    </v-layout>
                  </v-container>
                </div>
                <div v-if="!fetching && showAvailableRooms">
                  <v-layout wrap container>
                    <v-flex xs12 v-for="room in rooms" :key="room.type" mb-1>
                      <v-card>
                        <v-card-text>
                          <v-layout align-center row wrap justify-space-between>
                            <v-flex xs12 sm4>
                              <div class="subheading font-weight-regular">
                                <span>Room number:&nbsp;</span>
                                <span>{{ room.number }}</span>
                              </div>
                            </v-flex>
                            <v-flex xs12 sm4>
                              <div class="subheading font-weight-regular">
                                <span>Room floor:&nbsp;</span>
                                <span>{{ room.floor }}</span>
                              </div>
                            </v-flex>
                            <v-flex xs12 sm4>
                              <v-btn
                                style="margin-left:0"
                                outline
                                large
                                @click="gotoCredentialsStep(room)"
                              >Book now</v-btn>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </div>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-container>
                  <div v-if="!loggedIn">
                    <v-layout wrap justify-center>
                      <v-btn
                        outline
                        large
                        :href="this.authURL"
                        :loading="loginning"
                        :disabled="loginning"
                        @click.capture="onLoginRequest"
                      >
                        <span class="mr-2">SIGN IN</span>
                      </v-btn>
                    </v-layout>
                  </div>
                  <div v-else>
                    <div v-if="fetchingUser">
                      <v-container my-5>
                        <v-layout my-5 justify-center>
                          <v-progress-circular :size="50" color="black" indeterminate></v-progress-circular>
                        </v-layout>
                      </v-container>
                    </div>
                    <div v-else>
                      <v-container grid-list-md>
                        <v-layout wrap align-start justify-space-between>
                          <v-flex xs12 md6>
                            <v-text-field
                              class="purple-input"
                              label="User Name"
                              disabled
                              v-model="userToUpdate.username"
                            />
                          </v-flex>
                          <v-flex xs12 md6>
                            <v-text-field
                              label="Email Address"
                              class="purple-input"
                              v-model="userToUpdate.email"
                            />
                          </v-flex>
                          <v-flex xs12 md6>
                            <v-text-field
                              label="First Name"
                              class="purple-input"
                              v-model="userToUpdate.firstName"
                            />
                          </v-flex>
                          <v-flex xs12 md6>
                            <v-text-field
                              label="Last Name"
                              class="purple-input"
                              v-model="userToUpdate.lastName"
                            />
                          </v-flex>
                          <v-flex xs12>
                            <v-textarea
                              class="purple-input"
                              label="Additional info (tell us more about you so we can make your life easier)"
                              v-model="userToUpdate.additionalInfo"
                            />
                          </v-flex>
                          <v-flex xs12>
                            <v-btn outline large @click="gotoConfirmStep()" style="margin-left:0">
                              <span>Continue</span>
                            </v-btn>
                            <v-btn outline large @click="gotoRoomsStep()" style="margin-left:0">
                              <span>Back</span>
                            </v-btn>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </div>
                  </div>
                </v-container>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-container>
                  <div v-if="updating">
                    <v-container my-5>
                      <v-layout my-5 justify-center>
                        <v-progress-circular :size="50" color="black" indeterminate></v-progress-circular>
                      </v-layout>
                    </v-container>
                  </div>
                  <div v-else>
                    <v-card class="mb-3">
                      <v-container v-if="this.selectedRoom">
                        <v-layout justify-start column>
                          <div class="mb-3 headline font-weight-light">Guest information:</div>
                          <div class="my-2 subheading font-weight-light">
                            <span class="font-weight-regular">Full name:&nbsp;</span>
                            <span
                              class="font-weight-light"
                            >{{ user.firstName }}&nbsp;{{ user.lastName }}</span>
                          </div>
                          <div class="my-2 subheading font-weight-light">
                            <span class="font-weight-regular">E-mail:&nbsp;</span>
                            <span class="font-weight-light">{{ user.email }}</span>
                          </div>
                          <div class="my-3 headline font-weight-light">Room information:</div>
                          <div class="my-2 subheading font-weight-light">
                            <span class="font-weight-regular">Room type:&nbsp;</span>
                            <span class="font-weight-light">{{ this.selectedRoomType.code }}</span>
                          </div>
                          <div class="my-2 subheading font-weight-light">
                            <span class="font-weight-regular">Bed type:&nbsp;</span>
                            <span class="font-weight-light">{{ this.selectedRoomType.bedType }}</span>
                          </div>
                          <div class="my-2 subheading font-weight-light">
                            <span class="font-weight-regular">Facilities:&nbsp;</span>
                            <span
                              class="font-weight-light"
                            >{{ this.selectedRoomType.facilities }}</span>
                          </div>
                          <div class="my-2 subheading font-weight-light">
                            <span class="font-weight-regular">
                              Room
                              <sup>number</sup>/
                              <sub>floor</sub>&nbsp;
                            </span>
                            <span class="font-weight-light">
                              <sup>{{ this.selectedRoom.number }}</sup>/
                              <sub>{{ this.selectedRoom.floor }}</sub>
                            </span>
                          </div>
                          <div class="my-3 headline font-weight-light">Payment information:</div>
                          <div class="my-2 subheading font-weight-light">
                            <v-layout justify-space-around row fill-height wrap>
                              <v-flex xs12 md4>
                                <span class="font-weight-regular">Check-In:&nbsp;</span>
                                <span class="font-weight-light">{{ this.inDate }}</span>
                              </v-flex>
                              <v-flex xs12 md4>
                                <span class="font-weight-regular">Check-Out:&nbsp;</span>
                                <span class="font-weight-light">{{ this.outDate }}</span>
                              </v-flex>
                              <v-flex xs12 md4>
                                <span class="font-weight-regular">Total nights:&nbsp;</span>
                                <span
                                  class="font-weight-light"
                                >{{ (new Date(this.outDate) - new Date(this.inDate))/(1000 * 3600 * 24) }}</span>
                              </v-flex>
                            </v-layout>
                          </div>
                          <div class="my-2 subheading font-weight-light">
                            <span class="font-weight-regular">Total price:&nbsp;</span>
                            <span
                              class="font-weight-light"
                            >{{ this.selectedRoomType.cost * (new Date(this.outDate) - new Date(this.inDate))/(1000 * 3600 * 24) }}&nbsp;$</span>
                          </div>
                        </v-layout>
                      </v-container>
                    </v-card>
                    <v-btn
                      style="margin-left:0"
                      outline
                      large
                      :loading="creating"
                      :disabled="creating"
                      @click="gotoBookingAddedStep()"
                    >
                      <span>Confirm</span>
                    </v-btn>
                    <v-btn
                      style="margin-left:0"
                      outline
                      large
                      :loading="creating"
                      :disabled="creating"
                      @click="gotoCredentialsStep(selectedRoom)"
                    >
                      <span>Back</span>
                    </v-btn>
                  </div>
                </v-container>
              </v-stepper-content>
              <v-stepper-content step="4">
                <v-container>
                  <div v-if="creating">
                    <v-container my-5>
                      <v-layout my-5 justify-center>
                        <v-progress-circular :size="50" color="black" indeterminate></v-progress-circular>
                      </v-layout>
                    </v-container>
                  </div>
                  <div v-else>
                    <v-container>
                      <v-layout container column class="headline font-weight-light">
                        <p>Booking with id "{{this.booking}}" has been created successfully!</p>
                        <p>
                          You can check all yours bookings in your
                          <router-link to="/dashboard/bookings">dashboard</router-link>.
                        </p>
                      </v-layout>
                    </v-container>
                  </div>
                </v-container>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </div>
      </v-container>
    </section>
  </div>
</template>
<script>
import NetworkError from "../components/NetworkError";
import { hotelApiImageUrl } from "../config/config";
import { authURL } from "../config/config.js";
import { mapGetters, mapActions } from "vuex";
import { CustomService } from "../services/storage.service";
export default {
  components: {
    NetworkError
  },
  props: ["roomTypeId"],
  data: () => ({
    inDate: new Date().toISOString().substr(0, 10),
    outDate: new Date(new Date().valueOf() + 1000 * 3600 * 24)
      .toISOString()
      .substr(0, 10),
    inDatePicker: false,
    outDatePicker: false,
    selectedRoomType: null,
    imageUrl: null,
    showAvailableRooms: false,
    bookingStepper: 0,
    authURL: authURL,
    selectedRoom: null,
    savedState: null,
    userToUpdate: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      additionalInfo: ""
    }
  }),

  computed: {
    ...mapGetters("error", ["networkError"]),
    ...mapGetters("roomType", ["roomTypes", "getting"]),
    ...mapGetters("booking", ["rooms", "fetching", "creating", "booking"]),
    ...mapGetters("auth", [
      "loggedIn",
      "loginning",
      "fetchingUser",
      "user",
      "updating",
      "isAdmin"
    ])
  },

  methods: {
    ...mapActions("roomType", ["fetchRoomTypes"]),
    ...mapActions("booking", ["fetchAvailableRooms", "createBooking"]),
    ...mapActions("auth", ["fetchUserDetails", "updateUser"]),
    allowedInDate(val) {
      return val >= new Date().toISOString().substr(0, 10);
    },
    allowedOutDate(val) {
      return val > this.inDate;
    },
    gotoBookingAddedStep() {
      if (this.isAdmin)
        this.createBooking({
          dateFrom: this.inDate,
          dateTo: this.outDate,
          roomId: this.selectedRoom.id,
          managerId: this.user.id
        });
      else
        this.createBooking({
          dateFrom: this.inDate,
          dateTo: this.outDate,
          roomId: this.selectedRoom.id,
          guestId: this.user.id
        });

      this.bookingStepper = 4;
    },
    gotoConfirmStep() {
      this.updateUser(this.userToUpdate);
      this.bookingStepper = 3;
    },
    gotoCredentialsStep(room) {
      this.selectedRoom = room;
      if (this.loggedIn) this.fetchUserDetails();
      this.bookingStepper = 2;
    },
    gotoRoomsStep() {
      this.check();
    },
    check() {
      if (this.selectedRoomType === null) {
        return;
      }
      let params = {
        in: this.inDate,
        out: this.outDate,
        code: this.selectedRoomType.code
      };
      this.fetchAvailableRooms(params);
      this.bookingStepper = 1;
    },
    onLoginRequest() {
      CustomService.savePathBack(this.$route.path);
      CustomService.saveStateToContinueBooking({
        bookingDate: {
          inDate: this.inDate,
          outDate: this.outDate
        },
        room: this.selectedRoom
      });
    }
  },

  created() {
    this.fetchRoomTypes();

    // load selected room to continue creating booking after signin
    this.savedState = CustomService.getStateToContinueBooking();
    if (this.savedState !== null) {
      CustomService.removeStateToContinueBooking();
    }
  },

  watch: {
    fetchingUser(val) {
      if (!val) {
        this.userToUpdate = Object.assign({}, this.user);
      }
    },
    selectedRoomType(val) {
      if (val !== null) {
        if (this.selectedRoomType.image === null)
          this.imageUrl = require("../assets/images/default.png");
        else this.imageUrl = hotelApiImageUrl + this.selectedRoomType.image;

        this.showAvailableRooms = false;

        this.$vuetify.goTo("#roomType", { duration: 600, offset: 150 });
      }
    },
    fetching(val) {
      if (!val) {
        this.showAvailableRooms = true;
        this.$vuetify.goTo("#rooms", { duration: 600 });

        // continue creating booking after signin
        if (this.savedState !== null) {
          let i = this.rooms
            .map(item => item.id)
            .indexOf(this.savedState.room.id);

          let room = this.rooms[i];
          this.gotoCredentialsStep(room);
          this.savedState = null;
        }
      }
    },
    inDate(val) {
      if (val >= this.outDate) {
        this.outDate = new Date(new Date(val).valueOf() + 1000 * 3600 * 24)
          .toISOString()
          .substr(0, 10);
      }

      this.showAvailableRooms = false;
    },
    outDate() {
      this.showAvailableRooms = false;
    },
    getting(val) {
      if (!val && this.roomTypeId) {
        let i = this.roomTypes.map(item => item.id).indexOf(this.roomTypeId);
        this.selectedRoomType = this.roomTypes[i];
      }

      // continue creating booking after signin
      if (!val && this.savedState !== null) {
        let i = this.roomTypes
          .map(item => item.id)
          .indexOf(this.savedState.room.roomTypeId);

        this.inDate = this.savedState.bookingDate.inDate;
        this.outDate = this.savedState.bookingDate.outDate;
        this.selectedRoomType = this.roomTypes[i];

        this.check();
      }
    }
  }
};
</script>
