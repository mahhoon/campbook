/**
 * もろもろ変数
 */
//現在ログインしているユーザID


/**
 * 認証部分
 **/
 
import {loginModal} from "./loginModal.js"
import {signupModal} from "./signupModal.js"



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
    'footer-wrap': footerWrap,
  },
  data: {
    loginModalShow: false,
    signupModalShow: false,
    nouser: '',
    usertop: true,
    registCampModalShow: false,
    camppage: false,
    currentUid: '',
    currentCamp: '',
    campTitle: '',
    campsiteName: ''
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
    },
    openNewcampModal() {
      this.registCampModalShow = true
    },
    closeNewcampModal() {
      this.registCampModalShow = false
    },
    openDetailPage() {
      this.camppage = true
      this.registCampModalShow = false
      this.usertop = false
      this.campTitle = firebase.database()
    },
    registCampdata(){
      firebase
      .database()
      .ref('campbook').push({
        uid: this.currentUid,
        campsitename: this.campsiteName,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
      this.openDetailPage()
    }
    
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('login', user.uid);
        this.currentUid = user.uid;
        this.nouser = false;
      } else {
        console.log('logout');
        this.nouser = true;
      }
    });     
  }
})

//jQuery

$(function(){
  //ハンバーガーメニュー

  $('.togglebtn__userindex').on('click', () => {
    $('.togglemenu__userindex').toggleClass('togglemenu-show');
  });
  $('.togglebtn__camppage').on('click', () => {
    $('.togglemenu__camppage').toggleClass('togglemenu-show');
  });


  //アコーディオン

  $('.campcontent_menubar').on('click', (e) => {
    $(e.target).next().slideToggle(200);
    $(e.target).toggleClass('close',200);
  });

  //スクロールに合わせてふわっと出す なぜかアロー関数だとエラーになる
  //Uncaught TypeError: r.getClientRects is not a function

  　/*
  $(window).scroll('scroll', () => {
    $('.fade').each( () => {
      const targetElement = $(this).offset().top;
      const scroll = $(window).scrollTop();
      const windowHeight = $(window).height();
      if (scroll > targetElement - windowHeight) {
        $(this).addClass('fade-show');
      }
    });
  });
    */

  $(window).scroll(function () {
    $('.fade').each(function () {
      const targetElement = $(this).offset().top;
      const scroll = $(window).scrollTop();
      const windowHeight = $(window).height();
      if (scroll > targetElement - windowHeight) {
        $(this).addClass('fade-show');
      }
    });
  });


});


