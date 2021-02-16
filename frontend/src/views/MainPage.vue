<template>
  <v-app id="inspire">
    <v-navigation-drawer
        app
        class="pa-3"
    >
      <v-dialog
          v-model="composeDialog"
          width="1000"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn x-large v-on="on" v-bind="attrs" class="justify-center"  elevation="3" block> + compose </v-btn>
        </template>

        <v-card class="pa-3">
          <v-row class="pa-3">`
            <v-text-field
                v-model="user.email"
                label="From"
                readonly
            ></v-text-field>

          </v-row>
          <v-combobox multiple
                      v-model="receivers"
                      label="To"
                      chips
                      deletable-chips
                      class="tag-input pa-3"


          >
          </v-combobox>
          <v-row class="pa-3">
            <v-text-field
                v-model="subject"
                label="Subject"
                class="pa-3"
            ></v-text-field>
            <v-col
                cols="2">
              <v-select
                  :items="['1','2','3','4']"
                  label="Importance"
                  dense
                  v-model="importance"
                  outlined
              ></v-select>
            </v-col>
          </v-row>

          <v-divider></v-divider>
          <v-textarea v-model="emailBody"></v-textarea>
          <v-card-actions>
            <v-file-input
                v-model="attachmentFiles"
                chips
                multiple
                label="Attachments"
            ></v-file-input>
            <v-spacer></v-spacer>

            <v-btn
                color="primary"
                text
                @click="sendEmail"
            >
              Send
            </v-btn>
            <v-btn
                text
                @click="saveEmailToDraft"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-list flat>
        <v-list-item-group
            v-model="basicFolderIndex"
            color="indigo"
        >
          <v-list-item
              v-for="(item,i) in basicFolders"
              :key="i"
              :value="i"
              @click="selectBasicFolder(i)"
          >

            <v-list-item-content>
              <v-list-item-title v-text="item"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-menu
          v-model="menu"
          :close-on-content-click="false"
          offset-x>
        <template v-slot:activator="{ on,attrs }">
          <v-btn x-large v-on="on" v-bind="attrs" class="justify-center"  elevation="3" block> + New Folder </v-btn>
        </template>
        <v-card class="pa-3">
          <v-text-field  label="Folder Name" class="pa-1" v-model="newFolderName"></v-text-field>
          <v-row class="pa-3" >
            <v-spacer></v-spacer>
          <v-btn @click="newFolder" class="justify-center" color="primary" text >Add</v-btn>
          <v-btn
              text
              @click="menu = false"
          >
            Cancel
          </v-btn>
          </v-row>
        </v-card>
      </v-menu>

      <v-list flat>
        <v-list-item-group
            v-model="userFolderIndex"
            color="indigo"
        >
          <v-list-item
              v-for="(item, i) in userFolders"
              :key="i"
              :value="i"

              @click="selectUserFolder(i)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-dialog
                  v-model="renameFolderDialogue" max-width="500px" persistent>
                <template v-slot:activator="{ on,attrs }">
                  <v-btn icon v-on="on" v-bind="attrs" :value="i" @click="setEditedFolder(i)" >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <v-card class="pa-5">
                  <v-row class="pa-3 justify-sm-space-around">
                      <v-text-field label="New Name" v-model="newNameFolder"></v-text-field>
                    <v-col clos="3">
                      <v-btn @click="renameFolder" text color="primary"> Rename </v-btn>
                    </v-col>
                  </v-row >
                  <v-row class="pa-3">
                  <v-col cols="2"></v-col>
                  <v-btn @click="deleteFolder" text color="primary"> Delete </v-btn>
                    <v-col cols="3"></v-col>
                  <v-btn @click="renameFolderDialogue=false" text> Close </v-btn>
                    <v-col cols="2"></v-col>
                  </v-row>
                  <v-spacer></v-spacer>
                </v-card>
              </v-dialog>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="blue" class="justify-sm-space-between">


      <v-toolbar-title class="pa-4">Mail</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
          v-model="searchWord"
          hide-details
          single-line
          label="search"
          width="500"
          class="justify-center"
      >
      </v-text-field>
      <v-btn icon @click="confirmSearch">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-menu
          offset-y
          left
          :close-on-content-click="false"
          v-model="filterMenu">
        <template v-slot:activator="{on,attrs}">
          <v-btn
              icon
              v-on="on"
              v-bind="attrs"
              @click="openFilter"
          >
            <v-icon>
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>
        <v-card class="pa-3">
          <v-text-field label="From" v-model="filterSender"></v-text-field>
          <v-text-field label="Subject" v-model="filterSubject"></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                text
                @click="filterMenu = false"
            >
              Cancel
            </v-btn>
            <v-btn
                color="primary"
                text
                @click="confirmFilter"

            >
              Filter
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-spacer></v-spacer>

      <v-btn icon @click="refresh"><v-icon>mdi-refresh</v-icon></v-btn>

      <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
      >
        <template v-slot:activator="{ on }" class="pa-4">
          <v-btn
              class="pa-2"
              icon
              x-large
              v-on="on"
          >
            <v-avatar
                color="black"
                size="40"
            >
              <span class="white--text headline">{{userInitials}}</span>
            </v-avatar>
          </v-btn>

        </template>
        <v-card class="pa-3 justify-center">
          <v-list-item-content class="justify-center" flat>
            <v-dialog
                v-model="userDialog"
                width="500"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                    class="pa-2"
                    icon
                    x-large
                    v-on="on"
                >
                  <v-avatar
                      color="black"
                      size="40"
                  >
                    <span class="white--text headline">{{userInitials}}</span>
                  </v-avatar>
                </v-btn>
              </template>
              <v-card class="pa-3">
                <p>{{ "First Name: " + user.firstName }} </p>
                <p>{{ "Last Name: " + user.lastName }}</p>
                <p>{{ "Gender: " + user.gender }}</p>
                <p>{{ "Birth Date: " + user.birthDate }} </p>

              </v-card>
            </v-dialog>
            <v-col cols="3"></v-col>
            <v-col cols="6" class="justify-center">
            <h3>{{user.firstName +" "+ user.lastName}}</h3>
            <p class="caption mt-1">
              {{user.email}}
            </p>
            </v-col>
            <v-col cols="3"></v-col>
            <v-divider class="my-3"></v-divider>
            <v-btn
                depressed
                rounded
                text
                @click="signOut"
            >
              Sign Out
            </v-btn>
          </v-list-item-content>
        </v-card>
      </v-menu>

      <v-btn
          icon
          @click="openContacts"
          class="pa-3"
      >
        <v-icon @click="drawer = !drawer" class="pa-2">mdi-account-multiple</v-icon>
      </v-btn>

    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        app
        right
    >
      <v-sheet
          color="blue"
          height="65"
          width="100%"
      >
        <v-toolbar-title class="font-weight-black text-h5 pa-4 d-flex justify-space-around" > Contacts </v-toolbar-title>
      </v-sheet>
      <v-dialog v-model="addContactDialog" width="500">
        <template v-slot:activator="{ on,attrs}">
          <v-row class="pa-4 justify-center">
          <v-btn v-on="on" v-bind="attrs" x-large class="justify-center text--lighten-2 pa-5" width="245" elevation="3" >+ Add Contact </v-btn>
          </v-row>
        </template>
        <v-card class="pa-3">
          <v-text-field label="Name" v-model="contactName"></v-text-field>
          <v-combobox multiple
                      v-model="contactEmails"
                      label="emails"
                      chips
                      deletable-chips
                      class="tag-input"
          >
          </v-combobox>
          <v-row class="pa-3">
            <v-spacer></v-spacer>
          <v-btn @click="addContact"  class="justify-center" color="primary" text > ADD </v-btn>
          <v-btn
              text
              @click="addContactDialog = false"
          >
            Cancel
          </v-btn>
          </v-row>
        </v-card>
      </v-dialog>

      <v-divider></v-divider>
      <v-expansion-panels accordion v-model="contactIndex">
        <v-expansion-panel
            v-for="(item,i) in contacts"
            :key="i"
            :value="i"
        >
          <v-expansion-panel-header class="font-weight-bold ">{{contacts[i].name}}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-list flat>
                <v-list-item-group
                    v-model="userFolderIndex"
                    color="indigo"
                    active-class=""
                >
                  <v-list-item
                      v-for="(item, i) in contacts[i].emails"
                      :key="i"
                      :value="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-spacer></v-spacer>
                      <v-btn icon @click="composeDialog=true; receivers.push(item);">
                          <v-icon>mdi-send</v-icon>
                      </v-btn>
                    </v-list-item-action>

                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-row>

            <v-row>
              <v-spacer></v-spacer>
            <v-dialog
                v-model="editContactDialogue" width="600px" persistent>
              <template v-slot:activator="{ on,attrs }">
                <v-btn icon v-on="on" v-bind="attrs"  @click="editContact">
                  <v-icon>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              <v-card class="pa-5">
                <v-row class="pa-3 justify-sm-space-around">
                  <v-text-field label="Name" v-model="newContactName"></v-text-field>
                  <v-col cols="2">
                    <v-btn @click="renameContact()" text color="primary"> Rename </v-btn>
                  </v-col>
                </v-row>
                <v-row class="pa-3">
                  <v-col cols="9">
                <v-combobox multiple
                            v-model="newContactEmails"
                            label="emails"
                            chips
                            deletable-chips
                            class="tag-input"
                >
                  </v-combobox>
                  </v-col>
                  <v-col cols="3">
                    <v-btn @click="saveContactEmails" color="primary" text> Save Emails </v-btn>
                  </v-col>
                </v-row>
                <v-row class="pa-3">
                  <v-col cols="10"></v-col>
                <v-btn @click="editContactDialogue=false" text> Close </v-btn>

                </v-row>

              </v-card>

            </v-dialog>
            <v-btn icon @click="deleteContact">
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>


    </v-navigation-drawer>

    <v-divider></v-divider>
    <template>
      <EmailsList :emailsFolder="currentFolder" :folders="mutableFolders" :searchWord="emitSearch" :filter="filter" :executeSearch="executeSearch" :executeRefresh="executeRefresh" ></EmailsList>
    </template>

    <template>
      <alert :message="message" v-model="displayAlert" ></alert>
    </template>
  </v-app>
</template>

<script>
import EmailsList from "@/components/EmailsList";
import Alert from "@/components/Alert"
import axios from 'axios';
import {Email} from "@/models/Email"
import {User} from "@/models/User"
import {Contact} from "@/models/Contact";

export default {
  name: "MainPage",
  components:{
    EmailsList,
    Alert
  },
  data(){
    return{
      addContactDialog:'',
      contactName:'',
      contactEmails:[],
      contactIndex:'',
      currentFolder:'inbox',
      basicFolderIndex:'',
      userFolderIndex:'',
      renameFolderDialogue:'',
      newNameFolder:'',
      message:'',
      displayAlert:false,
      attachmentFiles:[],
      selectedFolder:'',
      userDialog:'',
      composeDialog:'',
      menu:false,
      userInitials:'',
      filterSign:false,
      searchSign:false,
      searchWord:'',
      basicFolders: ['Inbox','Draft','Sent','Trash'],
      drawer: null ,
      userFolders: [],
      folderName:0,
      contacts:[],
      receiver:'',
      userId:'',
      mutableFolders:["Inbox","Trash"],
      searchFor:'',
      newFolderName:'',
      receivers:[],
      subject:'',
      importance:4,
      emailBody:'',
      attachments:[],
      url:'http://localhost:8085/Api',
      user:new User(0,'','','','','',''),
      userEmail:'',
      editFolderIndex:'',
      filterMenu:false,
      filter:['',''],
      executeSearch:false,
      filterSubject:'',
      filterSender:'',
      emitSearch:'',
      editContactDialogue:'',
      newContactName:'',
      newContactEmails:[],
      executeRefresh:false
    }
  },
  methods: {

    openFilter() {
      this.filterSign = !this.filterSign;
      this.searchWord='';
    },
    signOut(){
      this.$router.push( '/');
    },
    compose(){

    },
    renameFolder(){
     this.renameFolderFromServer(this.userFolders[this.editFolderIndex],this.newNameFolder);
      this.renameFolderDialogue=false;

    },
    setEditedFolder(folder){
      console.log(folder);
      this.editFolderIndex = folder;
    },
    deleteFolder(){
      this.deleteFolderFromServer(this.userFolders[this.editFolderIndex]);
      this.userFolders.splice(this.editFolderIndex,1);
      this.mutableFolders.splice(this.editFolderIndex+2,1);
      this.renameFolderDialogue=false;
    },
    newFolder(){
      if(this.newFolderName !== ''){
        this.addFolderToServer();
        this.menu = false;
      }
    },
    async saveEmailToDraft(){
      this.composeDialog=false;
      let email;
      await this.saveAttachments()
      email = new Email(-1,this.subject,this.user.email,this.receivers,this.emailBody,this.importance,this.attachments,null);
      await this.sendEmailToServer(email,'Draft');
      this.message='Email is saved to draft';
      this.displayAlert=true;
      this.resetComposeDialogue();

    },
    async saveAttachments(){
      //this.attachments=[];
      for(let j=0;j<this.attachmentFiles.length;j++){
        let file=new FormData();
        file.append("file",this.attachmentFiles[j]);
        await axios({url:this.url+'/saveAttachment',method:'POST',data:file,headers:{Accept:'application/json','Content-Type':'multipart/form-data'},}).then(function (response) {
          let path = response.data;
          console.log(path);
          this.attachments.push(path);
        }.bind(this));
      }
    },

    async sendEmail(){
      // let date = this.getCurrentDate().toString();
      //console.log(date)
      let i=0;
      let email;
      for(i=0;i<this.receivers.length;i++) {
        if(!this.validateEmail(this.receivers[i])){0
          break;
        }
      }
      if(i===this.receivers.length && this.receivers.length!==0){
        await this.saveAttachments();
        console.log(this.attachments.toString());
        email = new Email(-1,this.subject,this.user.email,this.receivers,this.emailBody,this.importance,this.attachments,null);
        await this.sendEmailToServer(email,'Sent');
      }else{
        this.message='Email of receivers is not valid';
        this.displayAlert=true;
      }

    },
    openContacts(){

    },
    deleteContact(){
      let contact;
      console.log(this.contactIndex);
     contact = this.contacts[this.contactIndex];
      this.contacts.splice(this.contactIndex,1);
      this.deleteContactFromServer(contact);
      this.message = "Contact is deleted successfully";
      this.displayAlert = true;
      this.contactIndex = undefined;
      this.resetContactDialgue();
    },
    editContact(){
       this.currentContact = new Contact(this.contacts[this.contactIndex].id,this.contacts[this.contactIndex].name,this.contacts[this.contactIndex].emails) ;
    },
    addContact(){
      let contact;
      if( this.contactName === "" ){
        this.message='Enter the contact name!';
        this.displayAlert=true;
        return;
      }
      for( let i = 0 ; i < this.contactEmails.length ; i++ ){
        if( !this.validateEmail(this.contactEmails[i])){
          this.message='Email(s) not valid!';
          this.displayAlert=true;
          return;
        }
      }
      contact= new Contact(0,this.contactName,this.contactEmails);

      this.addContactToServer(contact);
      this.addContactDialog=false;
    },
    renameContact(){

      if( this.newContactName === "" ){
        this.message='Enter the contact name!';
        this.displayAlert=true;
        return;
      }
      this.contacts[this.contactIndex].name = this.newContactName;
      this.renameContactFromServer(this.contacts[this.contactIndex].id,this.newContactName);
      this.resetEditContactDialogue();
      this.editContactDialogue = false;

    },
    saveContactEmails(){
      for( let i = 0 ; i < this.newContactEmails ; i++ ){
        if( !this.validateEmail(this.newContactEmails[i])){
          this.message='Email(s) not valid!';
          this.displayAlert=true;
          return;
        }
      }
      this.contacts[this.contactIndex].emails = this.newContactEmails;
      this.editContactEmailsFromServer(this.contacts[this.contactIndex].id,this.newContactEmails);
      this.editContactDialogue = false;
      this.resetEditContactDialogue();


    },
    confirmSearch(){
      //this.filter = ['',''];
      this.emitSearch = this.searchWord;
      this.executeSearch =! this.executeSearch;
   //   this.filterSubject ='';
    //  this.filterSender = '';

     // this.executeSearch = false;
    },
    confirmFilter(){
      //this.emitSearch ='';
      this.filter = [ this.filterSubject , this.filterSender ];
      this.executeSearch =! this.executeSearch;
      this.filterMenu = false;
    //  this.filterSender='';
     // this.filterSubject='';
    },
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },


    resetSearchAndFilter(){
      this.searchWord='';
      this.filterSender='';
      this.filterSubject='';
      this.emitSearch='';
      this.filter=['',''];

    },
    resetComposeDialogue(){
      this.composeDialog=false;
      this.receivers=[];
      this.subject='';
      this.emailBody='';
      this.importance='';
      this.attachments=[];
    },
    resetContactDialgue(){
      this.contactName = '';
      this.contactEmails='';
    },
    resetEditContactDialogue(){
      this.newContactEmails =[];
      this.newContactName='';
    },
    setUserInitials(){
      this.userInitials = this.user.firstName.charAt(0)+this.user.lastName.charAt(0);
    },
    selectBasicFolder(i){
      this.resetSearchAndFilter();
      this.currentFolder=this.basicFolders[i];
      //this.executeSearch = !this.executeSearch;
      this.basicFolderIndex = undefined;
       this.userFolderIndex=false;
    },
    selectUserFolder(i){
      this.resetSearchAndFilter();
      this.currentFolder=this.userFolders[i];
     // this.executeSearch = !this.executeSearch;
      this.userFolderIndex = undefined;
      this.basicFolderIndex=false;
    },
    addFolderToServer(){
      let url = this.url+"/addFolder"
      axios.post(url, {
        id: this.userId,
        folderName: this.newFolderName
      })
          .then(function (response) {
            console.log(response.data);
            this.message = response.data;
            if( response.data === "done"){
              this.message = 'Folder created successfully'
              this.addNewFolder();
            }

            this.newFolderName='';
            this.displayAlert = true;
          }.bind(this));
    },
    addNewFolder(){
      this.userFolders.push(this.newFolderName);
      this.mutableFolders.push(this.newFolderName);
    },
  loadFoldersFromServer(){
      this.userFolders = [];
      this.mutableFolders=["Inbox","Trash"];
    let url = this.url+"/loadFolders";
    axios.get(url,{params: {id: this.userId}})
        .then(function (response) {
          console.log(response.data);
          let loadedFolders = response.data;
          console.log(loadedFolders);
          for( let i = 0 ; i < loadedFolders.length ; i++ ){
            this.loadFolder(loadedFolders[i]);
          }
        }.bind(this));

  },
    deleteFolderFromServer(folder){
      let url = this.url+"/deleteFolder";
      let data = { id: this.userId, folderName: folder };
      axios.delete(url, { data: data });

    },
    renameFolderFromServer(folder,newName){
      let url = this.url+"/renameFolder";
      let data = { id: this.userId, folderName: folder , newName: newName };
      axios.put(url, data)
          .then(function (response) {
            console.log(response.data);
            if( response.data === "done" ){
              this.message = "Folder is renamed successfully!";
              this.renameSuccess();
            }
            else{
              this.message = response.data;
            }
            this.newNameFolder='';

            this.displayAlert = true;
          }.bind(this));

    },
    renameSuccess(){
      this.userFolders[this.editFolderIndex]=this.newNameFolder;
      this.mutableFolders[this.editFolderIndex+2]=this.newNameFolder;
    },

    loadUserInfoFromServer(){
      let url = this.url+"/getUserInfo"
      axios.get(url,{ params: {id: this.userId }})
          .then(function (response) {
            console.log(response.data);
            let data;
            data = response.data;

              this.user = new User(data?.id,data?.firstName,data?.lastName,data?.email,data?.password,data?.gender,data?.birthDate);
              console.log(this.user);
              this.setUserInitials();
          }.bind(this));
    },
    loadFolder(folder){
      this.userFolders.push(folder);
      this.mutableFolders.push(folder);
    },
    async sendEmailToServer(email,folderName){
      let url = this.url+"/sendEmail"
      let data ={
        id: this.userId,
        folderName: folderName,
        email: email
      };
      console.log(data);
     await axios.post(url, data )
          .then(function (response) {
            console.log(response.data);
            if(folderName === 'Sent'){
              if(response.data.length===0){
                this.message = "Email is sent successfully!"
                this.resetComposeDialogue();
              }
              else{
                let emails = response.data;
                this.message ='';
                for(let i = 0 ; i < emails.length ; i++){
                  this.message = this.message + emails[i] + "\n" ;
                }
                this.receivers='';
              }
              this.displayAlert = true;
            }


          }.bind(this));
    },

  loadContactsFromServer() {
      this.contacts=[];
    let url = this.url + "/loadContacts";
    axios.get(url, {params: {id: this.userId}})
        .then(function (response) {
          console.log(response.data);
          console.log("load");
          let loadedContacts = response.data;
          console.log("hi");
          console.log(loadedContacts.length);
          for (let i = 0; i < loadedContacts.length; i++) {
            this.loadContact(loadedContacts[i]);
          }
        }.bind(this));

  },
    loadContact(loadedContact){
      let contact = new Contact(loadedContact.id,loadedContact.name,loadedContact.emails);
      this.contacts.push(contact);
    },
    addContactToServer(contact){
      let url = this.url+"/addContact"
      axios.post(url, {
        id: this.userId,
        contact: contact
      })
          .then(function (response) {
            console.log(response.data);
            this.message = 'Contact created successfully'
            this.displayAlert = true;
            this.loadContactsFromServer()
          }.bind(this));
    },
    deleteContactFromServer(contact){
      let url = this.url+"/deleteContact";
      let data = { id: this.userId, contactId: contact.id };
      axios.delete(url, { data: data });


    },
    renameContactFromServer(contactId,name){
      let url = this.url+"/renameContact";
      let data = { id: this.userId, contactId: contactId , name: name };
      axios.put(url, data)
          .then(function () {
            this.message = "Contact is renamed successfully!";
            this.displayAlert = true;
          }.bind(this));

    },
    editContactEmailsFromServer(id,emails){
      let url = this.url+"/editContactEmails";
      let data = { id: this.userId, contactId: id , emails: emails };
      axios.put(url, data)
          .then(function () {
            this.message = "Contact emails is saved successfully!";
            this.displayAlert = true;
          }.bind(this));

    },
    refresh(){
      this.loadContactsFromServer();
      this.loadFoldersFromServer();
      this.executeRefresh = !this.executeRefresh;
      this.resetSearchAndFilter();
    }

  },

  created() {
    this.userId = this.$route.params.id;
    this.loadFoldersFromServer();
    this.loadUserInfoFromServer();
    this.loadContactsFromServer();
  },
}
</script>

<style scoped>

</style>
