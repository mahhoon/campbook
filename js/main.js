/**
 * 認証部分
 **/
 
//ログインコンポーネント
const loginModal= {
  template: `
    <div class="modal-wrapping" id="modal-login">
      <div class="overlay">
        <form class="modal-wrapping" v-on:submit.prevent="logIn(loginEmail,loginPassword)">
            <div class="close-modal" v-on:click="clickEvent"><i class="fa fa-2x fa-times"></i></div>
            <p class="modal-wrapping__title">ログイン</p>
            <div class="modal-wrapping__name">メールアドレス</div>
            <input type="e-mail" class="modal-wrapping__formcontrol login-email" v-model="loginEmail">
            <div class="modal-wrapping__name">パスワード</div>
            <input type="password" class="modal-wrapping__formcontrol login-password" v-model="loginPassword">
            <div class="modal-msgbox"><p class="modal-errormsg" v-show="errormsg">メールアドレスかパスワードが間違っています..</p></div>
            <button type="submit" class="modal-wrapping__submit">ログイン</button>
        </form>
      </div>
    </div>
  `,
  methods: {
    clickEvent() {
      this.$emit('from-child')
    },
    logIn(email,pass) {
      firebase.auth()
        .signInWithEmailAndPassword(email, pass)
        .then((user) =>{
          console.log('ログインしました', user);
        })
        .catch((error) => {
          console.error('ログインエラー', error);
          this.errormsg = true
        })
    },
  },
  props: ['loginemail','loginpass'],
  data() {
    return {
      loginEmail: this.loginemail,
      loginPassword: this.loginpass,
      errormsg: false
    }
  }
}
 
//新規登録コンポーネント
const signupModal= {
  template: `
   <div class="modal-wrapping" id="modal-signup">
      <div class="overlay">
        <form class="modal-wrapping" v-on:submit.prevent="signUp(signupEmail,signupPassword)">
            <div class="close-modal" v-on:click="clickEvent"><i class="fa fa-2x fa-times"></i></div>
            <p class="modal-wrapping__title">新規登録</p>
            <div class="modal-wrapping__name">メールアドレス</div>
            <input type="e-mail" class="modal-wrapping__formcontrol login-email" v-model="signupEmail">
            <div class="modal-wrapping__name">パスワード</div>
            <input type="password" class="modal-wrapping__formcontrol login-password" v-model="signupPassword">
            <div class="modal-msgbox"><p class="modal-errormsg" v-show="errormsg">パスワードは6文字以上にしてください</p></div>
            <button type="submit" class="modal-wrapping__submit">新規登録</button>                    
        </form>
      </div>
    </div>
  `,
  methods: {
    clickEvent() {
      this.$emit('from-child')
    },
    signUp(email, pass) {
      firebase.auth()
        .createUserWithEmailAndPassword(email, pass)
        .then((user) => {
          console.log('登録しました', user);
        })
        .catch((error) => {
          console.log(error.code);
          if(error.code === 'auth/weak-password'){
            this.errormsg = true
          }
        });
    },
  },
  props: ['signupemail','signuppass'],
  data(){
    return{
      signupEmail: this.signupemail,
      signupPassword: this.signuppass,
      errormsg: false
    };
  }
}

//フッター
const footerWrap = {
  template: `
  <footer class="container">
       <p>&copy; luonto 2021</p>
  </footer>
  `
}
 
 
//インスタンス
new Vue({
  el: '#app',
  components: {
    'login-modal': loginModal,
    'signup-modal': signupModal,
    'footer-wrap': footerWrap
  },
  data: {
    loginModalShow: false,
    loginEmail: '',
    loginPassword: '',
    signupModalShow: false,
    signupEmail: '',
    signupPassword: '',
    nouser: ''
  },
  methods: {
    openLoginModal() {
      this.loginModalShow = true
    },
    closeLoginModal() {
      this.loginModalShow = false
    },
    openSignupModal() {
      this.signupModalShow = true
    },
    closeSignupModal() {
      this.signupModalShow = false
    },
    logOut() {
      firebase.auth().signOut();
      this.closeLoginModal();
      this.closeSignupModal();
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('login');
        this.nouser = false;
      } else {
        console.log('logout');
        this.nouser = true;
      }
    });     
  }
})