//新規登録コンポーネント
export const signupModal= {
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
  data(){
    return{
      signupEmail: '',
      signupPassword: '',
      errormsg: false
    };
  }
}