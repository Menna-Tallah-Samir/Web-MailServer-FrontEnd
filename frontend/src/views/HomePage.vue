<template>

  <v-container>
    <v-navigation-drawer
        v-model="drawer"
        app
    >
      <v-btn @click="action">change</v-btn>
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar
        app
        color="primary"
     >
      <v-toolbar-title >Mail</v-toolbar-title>
    </v-app-bar>

    <v-divider></v-divider>

    <template>
      <EmailsList :emailsFolder="emailsFolder" :folders="folders" ></EmailsList>

    </template>
    </v-container>








</template>
<script>
import EmailsList from "@/components/EmailsList.vue"



export default {
  name: "HomePage",
  components:{
    EmailsList
  },
  data() {
    return {
      drawer: null,
      userId:'',
      emailsFolder:'Inbox',
      folders:["Inbox","Draft","Trash"]
    }
  },
  created() {
    this.userId = this.$route.params.id;

  },
  methods:{
    action(){
      this.emailsFolder = 'Trash';
    }

  }

}
</script>
