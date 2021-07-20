
//ログインコンポーネント
export const loginModal= {
  template: `
    <div class="modal-wrapping" id="modal-login">
      <div class="overlay">
        <form class="modal-wrapping" v-on:submit.prevent="logIn(loginEmail,loginPassword)">
            <div class="close-modal" v-on:click="clickEvent"><i class="fa fa-2x fa-times"></i></div>
            <p class="modal-wrapping__title">ログイン</p>
            <div class="modal-wrapping__name">メールアドレス</div>
            <input type="email" class="modal-wrapping__formcontrol login-email" v-model="loginEmail" v-on:keyup="checkEmail">
            <div class="modal-msgbox"><p class="modal-errormsg" v-show="errormsgInvalid">無効なメールアドレスです</p></div>
            <div class="modal-wrapping__name">パスワード</div>
            <input type="password" class="modal-wrapping__formcontrol login-password" v-model="loginPassword" v-on:keyup="checkPassword">
            <div class="modal-msgbox"><p class="modal-errormsg" v-show="errormsg">メールアドレスかパスワードが間違っています..</p></div>
            <button type="submit" class="modal-wrapping__submit" v-bind:disabled="addDisabled">ログイン</button>
        </form>
      </div>
    </div>
  `,
  methods: {
    //閉じるボタンイベント受け渡し
    clickEvent() {
      this.$emit('from-child')
    },
    
    //バリデーション
    checkEmail() {
      const check = v8n()
        .not.null()
        .string() // 文字列
        .minLength(5) // a@b.c を想定して最低5文字
        .pattern(/[^\s@]+@[^\s@]+\.[^\s@]+/) // eメール用の正規表現
        .test(this.loginEmail)// 検証
      console.log(check);
      if (!check) {
        this.errormsgInvalid = true;
      } else {
        this.errormsgInvalid = false;
      }
      this.toggledisabled()
    },
    checkPassword() {
      this.toggledisabled()
    },
    toggledisabled() {
      if (this.loginEmail.length !== 0 && this.loginPassword.length !== 0){
        // console.log('ここまで動いてます！');
        if(!this.errormsgInvalid){
          // console.log('さらにここまでも動いてます！')
          this.addDisabled = false;
        } 
      }
      if (this.loginEmail.length === 0 || this.loginPassword.length === 0 || this.errormsgInvalid) {
        this.addDisabled = true;
      }
    },
    
    
    //ログイン
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
  data() {
    return {
      loginEmail: '',
      loginPassword: '',
      errormsg: false,
      errormsgInvalid: false,
      addDisabled: true
    }
  }
}