<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    ></v-app-bar>

    <v-container
        class="fill-height justify-center"
        fluid
    >
      <v-col
          cols="4"
      >
        <v-card
            outlined
            height="555"
            width="800"
        >
          <v-card-title class="justify-center ">
            Sign Up
          </v-card-title>
          <v-form class="px-3" ref="signUpForm">
            <v-row
                class="justify-md-space-between"
            >
              <v-col
                  col="5"
              >
                <v-text-field label="First Name" v-model="firstName" :rules="nameRule"></v-text-field>
              </v-col>
              <v-col
                  col="5"
              >
                <v-text-field label="Second Name" v-model="secondName" :rules="nameRule"></v-text-field>
              </v-col>
            </v-row>

            <v-text-field label="Email" suffix="@mail.com" v-model="email" :rules="emailRule"></v-text-field>

            <v-text-field label="password"
                          v-model="password"
                          :type="showPassword? 'text' : 'password'"
                          :rules="passwordRule"
                          prepend-icon="mdi-lock"
                          :append-icon=" showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append ="showPassword =!showPassword">
            </v-text-field>

            <v-row
                class="justify-md-space-between"
            >
              <v-col
                  col="5"
              >
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        label="Picker in menu"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="rules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="date"
                      no-title
                      scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col
                  col="5"
              >
                <v-select
                    :items="genderItems"
                    label="Gender"
                    :rules="rules"
                    v-model="gender"
                ></v-select>
              </v-col>
            </v-row>

            <v-btn  @click="signUp" class="justify-center"  elevation="3" block> Sign Up </v-btn>
            <v-col class="mb-2"> </v-col>
            <p class="text-caption">
              Already have an account?
            </p>
            <v-btn  @click="signIn" class="justify-center"  elevation="3" block> Sign In </v-btn>
          </v-form>
        </v-card>
      </v-col>

    </v-container>
  </v-app>
</template>

<script>
import axios from "axios"
import {User} from "@/models/User.js"

export default {
  name: "SignUp",
  data() {
    return {
      firstName:'',
      secondName:'',
      email:'',
      savedEmail:'',
      password:'',
      date:'',
      gender:'',
      menu:'',
      showPassword: false,
      genderItems: ['Male', 'Female'],
      nameRule: [
        v => !!v || 'This field is required',
        v => /^[a-zA-Z]+$/.test(v) || 'Name must be valid',
      ],
      passwordRule: [
        v => !!v || 'This field is required',
        v => v.length >= 6 || 'Password is too short',
      ],
      emailRule: [
        v => !!v || 'This field is required',
        v => v.length >= 4 || 'Email is too short',
        v => /^[0-9a-zA-Z]+$/.test(v) || 'Email must be valid',
      ],
      rules: [
        v => !!v || 'This field is required',
      ],
      url:'http://localhost:8085/Api/signUpValidation'

    }

  },

  methods: {
    signUp(){
      if(this.$refs.signUpForm.validate()){
        this.savedEmail=this.email+"@mail.com";
        console.log(this.firstName,this.secondName,this.savedEmail,this.password,this.gender ,this.date);
         this.user = new User(0,this.firstName,this.secondName,this.savedEmail,this.password,this.gender ,this.date);
         this.requestValidation();


      }else{
        console.log("invalid");
      }
    },
    signIn(){
      this.$router.push('/');

    },
    requestValidation(){
      axios.post(this.url, this.user)
          .then(function (response) {
            let id = response.data;
            console.log(id);
            if( id !== -1){
              this.goToHomePage(id);
            }
          }.bind(this));
    },
    goToHomePage(id){
      this.$router.push({name: 'MainPage', params: {id: id}});
    }
  }
}

</script>

<style scoped>

</style>
