<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
    </v-app-bar>
    <v-spacer></v-spacer>
    <v-container
        class="fill-height justify-center"
        fluid
        ma-1
    >
      <v-col
          cols="3"

      >

        <v-card
            outlined
            height="500"
            width="800"
            class="mx auto mt-9"
        >
          <v-card-title class="justify-center ">
            Sign in to your Mail!
          </v-card-title>

          <v-card-text >
            <v-form class="px-3" ref="signInForm">
              <v-text-field full-width label="email" v-model="email" :rules="emailRules"  prepend-icon="mdi-email" suffix="@mail.com" >
              </v-text-field>
              <v-text-field
                  label="password"
                  v-model="password"
                  :type="showPassword? 'text' : 'password'"
                  :rules="passwordRules"
                  prepend-icon="mdi-lock"
                  :append-icon=" showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append ="showPassword =!showPassword" >
              </v-text-field>
              <v-col class="mb-1 justify-center">
                {{ error}}
              </v-col>
              <v-btn  @click="signIn" class="justify-center"  elevation="3" block> Log In </v-btn>
              <v-col class="mb-5"> </v-col>

               <v-col class="mb-1 justify-center">
                Don't have an account?
               </v-col>
              <v-btn  class="justify-center"  elevation="3" @click="signUp" block> Create new account </v-btn>


            </v-form>
          </v-card-text>

        </v-card>
      </v-col>
    </v-container>




  </v-app>
</template>


<script>
import axios from 'axios'
export default {
  name: "SignIn",
  data() {
    return {
      email: '',
      password: '',
      showPassword:false,
      emailRules: [
        v => !!v|| "email is required",
        v => /^[0-9a-zA-Z]+$/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v|| "password is required",
        v => v.length >=6 || "invalid password"
      ],
      url:'http://localhost:8085/Api/signInValidation',
      error:''

    }
  },
  methods:{
    signIn(){
      if(this.$refs.signInForm.validate()){
        console.log(this.email,this.password);

        this.requestValidation();


      }
      else {
        console.log("invalid");
      }
  },
    signUp(){
      this.$router.push('/SignUp');
    },
    requestValidation(){
      axios.get(this.url,{params: {email:this.email+"@mail.com" , password:this.password}})
          .then(function (response) {
            let id = response.data;
            console.log(id);
            if( Number.isInteger(id) ){
              this.goToHomePage(id);
            }
            else{
              this.error = id;
              this.password='';
              this.email ='';
            }

          }.bind(this))
      //  console.log(this.shapesArray[3]);
    },
    goToHomePage(id){
      this.$router.push({name: 'MainPage', params: {id: id}});
    }
  }
}
</script>

<style scoped>

</style>
