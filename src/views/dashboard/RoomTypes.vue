<template>
  <div>
    <v-container>
      <v-layout justify-center column fill-height my-5>
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
          <div class="mb-1">
            <v-toolbar flat color="white">
              <v-toolbar-title>Room types</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="600px" lazy>
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm6 md4>
                          <v-text-field v-model="editedItem.code" label="Room type code"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                          <v-text-field v-model="editedItem.cost" label="Cost ($)"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                          <v-text-field v-model="editedItem.size" label="Size"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                          <v-text-field v-model="editedItem.categories" label="Categories "></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                          <v-text-field v-model="editedItem.bedType" label="Bed type"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                          <v-text-field v-model="editedItem.facilities" label="Facilities"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="deleteDialog" max-width="600px" lazy>
                <v-card>
                  <v-card-title class="headline">Deleting a room type</v-card-title>
                  <v-card-text v-if="delItem!=null">
                    <p>You have selected to delete room type with code: {{delItem.code}}.</p>
                    <p>If this was the action you wanted to do, please confirm your choise, or cancel and return to the page.</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat="flat" @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat="flat" @click="deleteConfirm">Delete</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="uploadImageDialog" max-width="600px" lazy>
                <v-card>
                  <v-img :src="image.url" aspect-ratio="2.75"></v-img>
                  <v-card-actions>
                    <input
                      type="file"
                      @change="onFilePicked"
                      color="blue darken-1"
                      flat="flat"
                      accept="image/*"
                      id="uploadCaptureInputFile"
                    >
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      flat="flat"
                      @click="uploadImageDialog = false"
                    >Cancel</v-btn>
                    <v-btn
                      color="blue darken-1"
                      flat="flat"
                      :disabled="!image.file"
                      @click="uploadImageConfirm"
                    >Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </div>
          <v-data-table :headers="headers" :items="roomTypes" class="elevation-1">
            <template v-slot:items="props">
              <td>{{ props.item.code }}</td>
              <td class="text-xs-left">{{ props.item.cost }}</td>
              <td class="text-xs-left">{{ props.item.size }}</td>
              <td class="text-xs-left">{{ props.item.categories }}</td>
              <td class="text-xs-left">{{ props.item.bedType }}</td>
              <td class="text-xs-left">{{ props.item.facilities }}</td>
              <td class="justify-center layout px-0">
                <v-icon small class="mr-2" @click="uploadImage(props.item)">image</v-icon>
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </template>
          </v-data-table>
        </div>
      </v-layout>
    </v-container>
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      :timeout="3000"
      top
      right
    >{{ snackbar.text }}</v-snackbar>
  </div>
</template>
<script>
import { hotelApiImageUrl } from "../../config/config";
import { mapGetters, mapActions } from "vuex";
import NetworkError from "../../components/NetworkError";
export default {
  data: () => ({
    dialog: false,
    deleteDialog: false,
    uploadImageDialog: false,
    image: {
      url: "",
      file: null,
      id: null
    },
    headers: [
      { text: "Room type code", align: "left", sortable: false, value: "code" },
      { text: "Cost ($)", value: "cost" },
      { text: "Size", value: "size" },
      { text: "Categories", value: "categories" },
      { text: "Bed type", value: "bedType" },
      { text: "Facilities", value: "facilities" },
      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    editedIndex: -1,
    editedItem: {
      code: "",
      cost: 0,
      size: 0,
      categories: "",
      bedType: "",
      facilities: ""
    },
    defaultItem: {
      code: "",
      cost: 0,
      size: 0,
      categories: "",
      bedType: "",
      facilities: ""
    },
    delItem: null,
    snackbar: {
      visible: false,
      color: "",
      text: ""
    }
  }),

  components: {
    NetworkError
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    ...mapGetters("roomType", [
      "roomTypes",
      "getting",
      "creating",
      "updating",
      "deleting",
      "errorCode",
      "errorMessage",
      "updatingImage"
    ]),
    ...mapGetters("error", ["networkError"])
  },

  watch: {
    uploadImageDialog(val) {
      if (!val) {
        document.getElementById("uploadCaptureInputFile").value = "";
      }
    },
    creating(val) {
      if (!val) {
        if (this.errorCode === 0) {
          this.snackbar.color = "success";
          this.snackbar.text = "New room type created successfully.";
        } else {
          this.snackbar.color = "error";
          this.snackbar.text =
            "Error creating new room type [" + this.errorCode + "]." + this.errorMessage;
        }
        this.snackbar.visible = false;
        setTimeout(() => {
          this.snackbar.visible = true;
        }, 100);
      }
    },
    updating(val) {
      if (!val) {
        if (this.errorCode === 0) {
          this.snackbar.color = "success";
          this.snackbar.text = "Room type updated successfully.";
        } else {
          this.snackbar.color = "error";
          this.snackbar.text =
            "Error updating room type [" + this.errorCode + "]." + this.errorMessage;
        }
        this.snackbar.visible = false;
        setTimeout(() => {
          this.snackbar.visible = true;
        }, 100);
      }
    },
    deleting(val) {
      if (!val) {
        if (this.errorCode === 0) {
          this.snackbar.color = "success";
          this.snackbar.text = "Room type deleted successfully.";
        } else {
          this.snackbar.color = "error";
          this.snackbar.text =
            "Error deleting room type [" + this.errorCode + "]." + this.errorMessage;
        }
        this.snackbar.visible = false;
        setTimeout(() => {
          this.snackbar.visible = true;
        }, 100);
      }
    },
    updatingImage(val) {
      if (!val) {
        if (this.errorCode === 0) {
          this.snackbar.color = "success";
          this.snackbar.text = "Room type image updated successfully.";
        } else {
          this.snackbar.color = "error";
          this.snackbar.text =
            "Error updating room type image [" + this.errorCode + "]." + this.errorMessage;
        }
        this.snackbar.visible = false;
        setTimeout(() => {
          this.snackbar.visible = true;
        }, 100);
      }
    }
  },

  created() {
    this.fetchRoomTypes();
  },

  methods: {
    ...mapActions("roomType", [
      "fetchRoomTypes",
      "createRoomType",
      "updateRoomType",
      "deleteRoomType",
      "updateRoomTypeImage"
    ]),

    uploadImage(item) {
      this.image.file = null;
      this.image.id = item.id;
      if (item.image === null)
        this.image.url = require("../../assets/images/default.png");
      else this.image.url = hotelApiImageUrl + item.image;
      this.uploadImageDialog = true;
    },

    uploadImageConfirm() {
      this.updateRoomTypeImage({ image: this.image.file, id: this.image.id });
      this.uploadImageDialog = false;
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.image.url = fr.result;
          this.image.file = files[0];
        });
      } else {
        this.image.file = null;
        this.image.url = "";
      }
    },

    editItem(item) {
      this.editedIndex = this.roomTypes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.delItem = item;
      this.deleteDialog = true;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        this.updateRoomType(this.editedItem);
      } else {
        this.createRoomType(this.editedItem);
      }
      this.close();
    },

    deleteConfirm() {
      this.deleteDialog = false;
      this.deleteRoomType(this.delItem.id);
    }
  }
};
</script>