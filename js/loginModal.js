//ログインコンポーネント
export const loginModal= {
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
    data() {
      return {
        loginEmail: '',
        loginPassword: '',
        errormsg: false
      }
    }
  }