<template>
  <div>
    <v-container>
      <v-layout justify-center column fill-height my-5>
        <div v-if="fetching">
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
              <v-toolbar-title>Rooms</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" @click="createItem()">New Item</v-btn>
              <v-dialog v-model="editDialog" max-width="600px" lazy>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm6 md3>
                          <v-text-field v-model="editedItem.number" label="Room number"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md3>
                          <v-text-field v-model="editedItem.floor" label="Floor number"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                          <v-select
                            :loading="this.getting"
                            v-model="selectedRoomType"
                            :items="roomTypes"
                            :disabled="this.getting"
                            item-text="code"
                            label="Room type"
                            persistent-hint
                            return-object
                            single-line
                          ></v-select>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="editDialog = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat :disabled="!selectedRoomType" @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="deleteDialog" max-width="600px" lazy>
                <v-card>
                  <v-card-title class="headline">Deleting a room</v-card-title>
                  <v-card-text v-if="delItem!=null">
                    <p>You have selected to delete room with number: {{delItem.number}}.</p>
                    <p>If this was the action you wanted to do, please confirm your choise, or cancel and return to the page.</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat="flat" @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat="flat" @click="deleteConfirm">Delete</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </div>
          <v-data-table :headers="headers" :items="rooms" class="elevation-1">
            <template v-slot:items="props">
              <td>{{ props.item.number }}</td>
              <td class="text-xs-left">{{ props.item.floor }}</td>
              <td class="text-xs-left">{{ props.item.roomType}}</td>
              <td class="justify-center layout px-0">
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
import { mapGetters, mapActions } from "vuex";
import NetworkError from "../../components/NetworkError";
export default {
  data: () => ({
    selectedRoomType: {},
    editDialog: false,
    deleteDialog: false,
    headers: [
      { text: "Room number", align: "left", value: "number" },
      { text: "Floor number", value: "floor" },
      { text: "Room type code", value: "type-code" },
      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ],
    editedIndex: -1,
    editedItem: {},
    delItem: {},
    defaultItem: {
      number: 0,
      floor: 0,
      roomType: null
    },
    snackbar: {
      visible: false,
      color: "",
      text: ""
    }
  }),

  created() {
    this.fetchRooms();
  },

  components: {
    NetworkError
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    ...mapGetters("room", [
      "rooms",
      "fetching",
      "creating",
      "updating",
      "deleting",
      "errorCode",
      "errorMessage"
    ]),
    ...mapGetters("error", ["networkError"]),
    ...mapGetters("roomType", ["roomTypes", "getting"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    creating(val) {
      if (!val) {
        if (this.errorCode === 0) {
          this.snackbar.color = "success";
          this.snackbar.text = "New room created successfully.";
        } else {
          this.snackbar.color = "error";
          this.snackbar.text =
            "Error creating new room [" + this.errorCode + "]." + this.errorMessage;
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
          this.snackbar.text = "Room updated successfully.";
        } else {
          this.snackbar.color = "error";
          this.snackbar.text = "Error updating room [" + this.errorCode + "]." + this.errorMessage;
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
          this.snackbar.text = "Room deleted successfully.";
        } else {
          this.snackbar.color = "error";
          this.snackbar.text = "Error deleting room [" + this.errorCode + "]." + this.errorMessage;
        }
        this.snackbar.visible = false;
        setTimeout(() => {
          this.snackbar.visible = true;
        }, 100);
      }
    },
  },

  methods: {
    ...mapActions("room", [
      "fetchRooms",
      "createRoom",
      "updateRoom",
      "deleteRoom"
    ]),
    ...mapActions("roomType", ["fetchRoomTypes"]),

    createItem() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.selectedRoomType = this.editedItem.roomType;
      this.editDialog = true;
      this.fetchRoomTypes();
    },

    editItem(item) {
      this.editedIndex = this.rooms.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.selectedRoomType = this.editedItem.roomType;
      this.editDialog = true;
      this.fetchRoomTypes();
    },

    deleteItem(item) {
      this.delItem = item;
      this.deleteDialog = true;
    },

    save() {
      this.editedItem.roomType = this.selectedRoomType;
      if (this.editedIndex > -1) {
        this.updateRoom(this.editedItem);
      } else {
        this.editedItem.roomType = this.editedItem.roomType.code;
        this.createRoom(this.editedItem);
      }
      this.selectedRoomType = null;
      this.editDialog = false;
    },

    deleteConfirm() {
      this.deleteDialog = false;
      this.deleteRoom(this.delItem.id);
    }
  }
};
</script>