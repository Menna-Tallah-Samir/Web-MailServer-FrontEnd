<template>
  <v-container>

      <v-toolbar
          :dark="selectionMode "
          dense
          height="40"
          text
      >

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-show="!selectionMode"
                key="sort"
                v-bind="attrs"
                v-on="on"
                text
            >
              Sort
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
                v-for="(sort, i) in sortBy"
                :key="i"
                @click="sortEmails(sort)"
            >
              <v-list-item-title>{{ sort }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-spacer></v-spacer>
        <v-menu offset-y >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                text
                :disabled="!selectionMode"
            >
              <v-icon>mdi-folder</v-icon>
              Move
            </v-btn>
          </template>
          <v-list>
            <v-list-item
                v-for="(folder, j) in folders"
                :key="j"
                @click="moveEmails(folder)"
            >
              <v-list-item-title>{{ folder }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>


        <v-menu offset-y >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                text
                :disabled="!selectionMode"
            >
              <v-icon>mdi-folder</v-icon>
              Copy
            </v-btn>
          </template>
          <v-list>
            <v-list-item
                v-for="(folder, j) in folders"
                :key="j"
                @click="copyEmails(folder)"
            >
              <v-list-item-title>{{ folder }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn

            key="delete"
            text
            :disabled="!selectionMode"
            @click="deleteEmails"
        >
          <v-icon>mdi-delete</v-icon>
          Delete
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
            v-show="!selectionMode"
            key="select"
            text
            @click="selectionMode=true"
        >
          Select
          <v-icon>mdi-cursor-default-outline</v-icon>
        </v-btn>

        <v-toolbar-title>
          {{ selectionMode ? `${selectedEmails.length} selected` : '' }}
        </v-toolbar-title>
        <v-btn
            v-if="selectionMode"
            icon
            @click="selectionMode=false; selectedEmails=[]"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>


      <v-list two-line style="height: 550px " class="overflow-y-auto m" flat >

        <v-list-item-group
            v-model="emailsListIndex"
            active-class=""
        >
          <template v-for="(email,i) in displayedEmails" >
            <v-list-item :key="email.id"   @click.native="viewEmail" :value="i"  >
              <v-list-item-content>
                <v-list-item-title v-text="email.subject"></v-list-item-title>

                <a></a>
                <v-list-item-subtitle
                    class="text--primary"
                    v-text="email.sender"
                ></v-list-item-subtitle>

                <v-list-item-subtitle v-text="email.emailBody"></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text v-text="email.date"></v-list-item-action-text>
              </v-list-item-action>

              <v-list-item-action v-show="selectionMode">
                <v-checkbox v-model="selectedEmails" :value="email.id"></v-checkbox>
              </v-list-item-action>
            </v-list-item>


          </template>
        </v-list-item-group>
      </v-list>


    <v-divider></v-divider>

    <template>
      <div class="text-center mt-2">
        <v-btn small rounded class="mx-2" @click="prevPage" :disabled="page===1">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        {{this.page }}
        <v-btn small rounded class="mx-2" @click="nextPage" :disabled="maxPageReached && page===maxPage">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </template>
    <EmailView   :email="viewedEmail" :isDraft="isDraft"  v-model="openEmail"/>
  </v-container>
</template>

<script>

import {Email} from "@/models/Email.js";
import EmailView from "@/components/EmailView";
import axios from "axios";

export default {
  name: "EmailsList",
  components: {EmailView},
  props: {
    emailsFolder: String,
    folders: Array,
    searchWord: String,
    filter: Array,
    executeSearch:Boolean,
  },
  data() {
    return {
      isDraft:false,
      action: true,
      selectedEmails: [],
      selectedEmailIndex:null,
      selectedEmail:null,
      userId: '',
      sortBy: ['Date', 'Subject','Importance', 'Sender'],
      emails: [],
      page: 1,
      displayedEmails:[],
      maxPage:1,
      maxPageReached:false,
      openEmail:false,
      selectionMode:false,
      url:'http://localhost:8085/Api',
      maxPageLoaded:0,
      emailsListIndex:'',
      emailInfo:[],
      currentSort:'Date',
      viewedEmail:new Email(0,'','',[],'',4,[],null)
    }
  },
  watch: {
    emailsFolder: function (newVal, oldVal) {
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this.reset();
      this.currentSort = "Date"
      this.loadEmailsFromServer();
      if(newVal === 'Draft'){
        this.isDraft = true;
      }
      console.log(this.filter,this.searchWord,this.currentSort,this.emailsFolder);

    },
    executeSearch: function( ){
       console.log(this.filter,this.searchWord,this.currentSort,this.emailsFolder);
       this.refresh();

    },
    executeRefresh: function( ){
     this.refresh();
    },
  },
  created() {
    this.userId = this.$route.params.id;
    console.log(this.filter,this.searchWord,this.currentSort,this.emailsFolder);
    this.reset();
    this.loadEmailsFromServer();
  },

  methods: {
    display() {
      console.log(this.selectedEmails);
      console.log(this.selectedEmail)
    },
    moveEmails(destinationFolder) {
      console.log(destinationFolder);
      this.moveEmailsRequest(destinationFolder,this.selectedEmails);
      this.refresh();
    },
    deleteEmails() {
      console.log(this.selectedEmails);
      this.deleteEmailsFromServer(this.selectedEmails);
    //  this.refresh();
    },
    copyEmails(destinationFolder) {
      console.log(destinationFolder);
      this.copyEmailsRequest(destinationFolder,this.selectedEmails);
      this.refresh();

    },
    sortEmails(sortType){
      console.log(sortType);
      this.currentSort = sortType;
      this.refresh();

    },
    removeEmailsFromList( removedEmailsIds ){
      //this.emails = this.emails.filter( email => ! (removedEmails.includes(email.id)));
      let filteredEmails=[];
      console.log(removedEmailsIds);
      console.log(removedEmailsIds.includes(1));

      for( let i = 0 ; i < this.emails.length ; i++){
        console.log(this.emails[i].id);
        if( ! removedEmailsIds.includes(this.emails[i].id) ){
          filteredEmails.push(this.emails[i]);
          console.log("hi");
        }
      }
      console.log(filteredEmails);
      this.emails= filteredEmails;

    },
    updateVisibleEmails() {
      console.log(this.emails.length);
      let from = (this.page - 1) * 10;
      let to = Math.min(this.page * 10, this.emails.length);
      if (to < this.page * 10) {
        console.log("iam her");
        this.maxPageReached = true;
        this.maxPage = this.page;
      }
      console.log(from, to);
      this.displayedEmails = this.emails.slice(from, to);
      console.log(this.maxPageReached)

    },
    nextPage() {
      console.log(this.page);
      this.page = this.page + 1;
      if (this.page > this.maxPageLoaded) {
        this.loadEmailsFromServer();
      } else {
        this.updateVisibleEmails();
      }

    },
    prevPage() {
      console.log(this.page);
      if (this.page > 1) {
        this.page = this.page - 1;
        this.updateVisibleEmails();
      }
    },
    viewEmail() {
      this.selectedEmailIndex = this.emailsListIndex;

      this.viewedEmail = this.displayedEmails[this.selectedEmailIndex];

      console.log(this.selectedEmailIndex);

      if (!this.selectionMode) {

        this.openEmail = true;

      }
      this.emailsListIndex = undefined;


    },
    reset() {
      this.isDraft = false;
      this.maxPageLoaded = 0;
      this.page = 1;
      this.maxPage = 0;
      this.maxPageReached = false;
      this.maxPageLoaded = 0;
      this.emails = [];
      this.displayedEmails = [];
      this.selectedEmails=[];
      this.selectionMode=false;
    },
    refresh(){
      this.reset();
      this.loadEmailsFromServer();

    }
    //requests to server
    ,
    loadEmail(loadedEmail) {
     // console.log(loadedEmail.date);
      let email = new Email(loadedEmail.id, loadedEmail.subject, loadedEmail.sender, loadedEmail.receiver, loadedEmail.emailBody, loadedEmail.importance, loadedEmail.attachments, loadedEmail.date);
      this.emails.push(email);
    },
    loadEmailsFromServer() {
      let url = this.url + "/loadSearchedEmails";
      this.maxPageLoaded = this.page;
      axios.get(url, {params: {id: this.userId, folderName: this.emailsFolder, page: this.page , search:this.searchWord , sort:this.currentSort , filterSubject:this.filter[0]  , filterSender:this.filter[1]}})
          .then(function (response) {
            console.log(response.data);
            console.log("load");
            let loadedEmails = response.data;
            console.log("hi");
            console.log(loadedEmails.length);
            for (let i = 0; i < loadedEmails.length; i++) {
              this.loadEmail(loadedEmails[i]);
            }
            this.updateVisibleEmails();
          }.bind(this));

    },
    async deleteEmailsFromServer(selectedEmailsIds){
      let url = this.url+"/deleteEmails";
      let data = { id: this.userId, folderName: this.emailsFolder , emailsIds:selectedEmailsIds };
      await axios.delete(url, { data: data });
      this.refresh();

    },
    moveEmailsRequest(destinationFolder,selectedEmailsIds){
      let url = this.url+"/moveEmails"
      let data = {
        id: this.userId,
        fromFolder: this.emailsFolder,
        toFolder:  destinationFolder,
        emailsIds: selectedEmailsIds
      };
      axios.post(url, data )
          .then(function (response) {
            console.log(response.data);
          }.bind(this));
    },
    copyEmailsRequest(destinationFolder,selectedEmailsIds){
      let url = this.url+"/copyEmails"
      let data = {
        id: this.userId,
        fromFolder: this.emailsFolder,
        toFolder:  destinationFolder,
        emailsIds: selectedEmailsIds
      };
      axios.post(url, data )
          .then(function (response) {
            console.log(response.data);
          }.bind(this));
    }

  }
}
</script>

<style >

</style>
