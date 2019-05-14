<template>
  <div>
    <v-container>
      <v-layout justify-center>
        <div v-if="fetchingUser ">
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
          <v-container fill-height fluid grid-list-xl>
            <v-layout justify-center wrap>
              <v-flex xs12 md4>
                <v-card>
                  <v-layout wrap>
                    <!-- <v-avatar class="mx-auto d-block my-2" size="150" >
                      <v-layout align-center justify-center row fill-height></v-layout>
                    </v-avatar>-->
                    <v-avatar class="mx-auto d-block my-2" size="150">
                      <v-img
                        @click="!updatingImage?launchFilePicker():null"
                        :style="!updatingImage? 'cursor: pointer':''"
                        :gradient="updatingImage?'rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)':null"
                        :src="this.imageUrl"
                      >
                        <v-progress-circular
                          v-if="updatingImage"
                          :size="150"
                          color="green"
                          indeterminate
                        ></v-progress-circular>

                        <input
                          v-else
                          type="file"
                          accept="image/*"
                          ref="file"
                          @change="onFileChange($event.target.name, $event.target.files)"
                          style="display:none"
                        >
                      </v-img>

                      <v-dialog v-model="errorDialog" max-width="300">
                        <v-card>
                          <v-card-text class="subheading">{{errorText}}</v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="errorDialog = false" flat>Got it!</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-avatar>
                    <v-card-text class="text-xs-center">
                      <h4 class="body-2 font-weight-light my-2">@{{user.username}}</h4>
                      <h4
                        class="title font-weight-light my-1"
                      >{{user.firstName}}&nbsp;{{user.lastName}}</h4>
                    </v-card-text>
                  </v-layout>
                </v-card>
              </v-flex>
              <v-flex xs12 md8>
                <v-card title="Edit Profile" text="Complete your profile">
                  <v-form>
                    <v-container py-0>
                      <v-layout wrap>
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
                            label="About me (tell us more about you so we can make your life easier)"
                            v-model="userToUpdate.additionalInfo"
                          />
                        </v-flex>
                        <v-flex xs12 text-xs-right>
                          <v-btn
                            class="mx-0 font-weight-light"
                            color="success"
                            :loading="updating"
                            @click="updateUserConfirm"
                          >Update Profile</v-btn>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-form>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { hotelApiImageUrl } from "../config/config";
import NetworkError from "../components/NetworkError";
export default {
  name: "image-input",
  data: () => ({
    errorDialog: null,
    errorText: "",
    maxSize: 1024,
    imageUrl: "",
    userToUpdate: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      additionalInfo: ""
    },
    defaultImageUrl: require("../assets/images/default-user.png")
  }),
  components: {
    NetworkError
  },
  computed: {
    ...mapGetters("auth", [
      "user",
      "fetchingUser",
      "updatingImage",
      "fetchingUser",
      "updating",
      "isAdmin"
    ]),
    ...mapGetters("error", ["networkError"])
  },
  mounted() {
    this.userToUpdate = Object.assign({}, this.user);
    this.updateImageUrl();
  },
  watch: {
    updatingImage(val) {
      if (val === false) {
        this.userToUpdate.image = this.user.image;
        this.updateImageUrl();
      }
    }
  },
  methods: {
    ...mapActions("auth", [
      "fetchUserDetails",
      "updateUserImage",
      "updateUser"
    ]),
    updateImageUrl() {
      if (this.user.image === null) this.imageUrl = this.defaultImageUrl;
      else this.imageUrl = hotelApiImageUrl + this.userToUpdate.image;
    },
    launchFilePicker() {
      this.$refs.file.click();
    },
    onFileChange(fieldName, file) {
      const { maxSize } = this;
      let imageFile = file[0];

      if (file.length > 0) {
        let size = imageFile.size / maxSize / maxSize;
        if (!imageFile.type.match("image.*")) {
          this.errorDialog = true;
          this.errorText = "Please choose an image file";
        } else if (size > 1) {
          this.errorDialog = true;
          this.errorText =
            "Your file is too big! Please select an image under 1MB";
        } else {
          this.updateUserImage(imageFile);
        }
      }
    },
    updateUserConfirm() {
      this.updateUser(this.userToUpdate);
    }
  }
};
</script>
