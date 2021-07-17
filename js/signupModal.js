
//新規登録コンポーネント
export const signupModal = {
  template: `
   <div class="modal-wrapping" id="modal-signup">
      <div class="overlay">
        <form class="modal-wrapping" v-on:submit.prevent="signUp(signupEmail,signupPassword)">
            <div class="close-modal" v-on:click="clickEvent"><i class="fa fa-2x fa-times"></i></div>
            <p class="modal-wrapping__title">新規登録</p>
            <div class="modal-wrapping__name">ニックネーム(8文字以内）</div>
            <input type="text" class="modal-wrapping__formcontrol login-nickname" v-model="signupNickname" v-on:keyup="checkNickname">
            <div class="modal-wrapping__name">メールアドレス</div>
            <input type="e-mail" class="modal-wrapping__formcontrol login-email" v-model="signupEmail" v-on:keyup="checkEmail">
            <div class="modal-msgbox">
            <p class="modal-errormsg" v-if="errormsgInvalid">無効なメールアドレスです</p>
            </div>
            <div class="modal-wrapping__name">パスワード(6文字以上）</div>
            <input type="password" class="modal-wrapping__formcontrol login-password" v-model="signupPassword" v-on:keyup="checkPassword">
            <div class="modal-msgbox">
            <p class="modal-errormsg" v-if="errormsgPass">パスワードは6文字以上にしてください</p>
            <p class="modal-errormsg" v-else-if="errormsgDuplicate">既に登録されているメールアドレスです</p>
            </div>
            <button type="submit" class="modal-wrapping__submit" v-bind:disabled=addDisabled>新規登録</button>                    
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
    checkNickname(){
      this.toggledisabled()
    },
    checkEmail() {
      const check = v8n()
        .not.null()
        .string() // 文字列
        .minLength(5) // a@b.c を想定して最低5文字
        .pattern(/[^\s@]+@[^\s@]+\.[^\s@]+/) // eメール用の正規表現
        .test(this.signupEmail)// 検証
      console.log(check);
      if (!check) {
        this.errormsgInvalid = true;
      } else {
        this.errormsgInvalid = false;
      }
      this.toggledisabled()
    },
    checkPassword() {
      const check = v8n()
        .not.null()
        .string() // 文字列
        .minLength(6) 
        .test(this.signupPassword)// 検証
      console.log(check);
      if (!check) {
        this.errormsgPass = true;
      } else {
        this.errormsgPass = false;
      }
      this.toggledisabled()
    },
    toggledisabled() {
      if (this.signupNickname.length !== 0 && this.signupEmail.length !== 0 && this.signupPassword.length !== 0){
        console.log('ここまで動いてます！');
        if(!this.errormsgInvalid && !this.errormsgPass){
          console.log('さらにここまでも動いてます！')
          this.addDisabled = false;
        } 
      }
      if (this.signupNickname.length === 0 || this.signupEmail.length === 0 || 
      this.signupPassword.length === 0 || this.errormsgInvalid || this.errormsgPass) {
        this.addDisabled = true;
      }
    },
    
    //サインアップ
    signUp(email, pass) {
      firebase.auth()
        .createUserWithEmailAndPassword(email, pass)
        .then((result) => {
          console.log('登録しました', result);
          result.user.updateProfile({
            displayName: this.signupNickname
          })
          // firebase.database().ref(`users/${result.user.uid}`).set({
          //   nickname: this.signupNickname,
          //   createdAt: firebase.database.ServerValue.TIMESTAMP,
          // });
        })
        .catch((error) => {
          console.log(error.code);
          if(error.code === 'auth/email-already-in-use') {
            this.errormsgDuplicate = true
          }
        });
    },
  },
  
  data(){
    return{
      signupNickname: '',
      signupEmail: '',
      signupPassword: '',
      errormsgPass: false,
      errormsgDuplicate: false,
      errormsgInvalid: false,
      addDisabled: true,
    };
  }
}