/**
 * 認証部分
 **/
 
 import {loginModal} from "./loginModal.js";
 import {signupModal} from "./signupModal.js";
 
 
 
 //フッター
 const footerWrap = {
   template: `
   <footer class="container">
        <p>&copy; luonto 2021</p>
   </footer>
   `
 };
  
  
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
     campsiteName: '',
     campsiteUrl: '',
     campsiteTel: '',
     fromCampDate:'',
     toCampDate:'',
     campTitle: '',
     campUrl: '',
     campTel: '',
     fromDate: '',
     toDate:  '',
     uploadFile: null,
     fileName: '',
     campImageLocation: '',
     downloadCampImage: '',
   },
   methods: {
     //表示切り替え
     openLoginModal() {
       this.loginModalShow = true;
     },
     closeLoginModal() {
       this.loginModalShow = false;
     },
     openSignupModal() {
       this.signupModalShow = true;
     },
     closeSignupModal() {
       this.signupModalShow = false;
     },
     logOut() {
       firebase.auth().signOut();
       this.closeLoginModal();
       this.closeSignupModal();
     },
     openNewcampModal() {
       this.registCampModalShow = true;
     },
     closeNewcampModal() {
       this.registCampModalShow = false;
     },
     goUserIndex(){
       this.camppage = false;
       this.usertop = true;
     },
     openDetailPage() {
       this.camppage = true;
       this.registCampModalShow = false;
       this.usertop = false;
     },
 
     //画像セレクト
     selectedFile(e) {
       e.preventDefault();
       let files = e.target.files;
       this.uploadFile = files[0];
       this.fileName = this.uploadFile.name;
     },
     
     //キャンプ登録
     registCampdata(){
       
       //画像ファイルアップ
       firebase
         .storage()
         .ref(`files/${this.fileName}`)
         .put(this.uploadFile)
         .then(()=>{
           firebase
             .storage()
             .ref(`files/${this.fileName}`)
             .getDownloadURL()
             
             .then ((url) => {
               this.downloadCampImage = url;
               console.log(url);
             });
         })
         .catch((error) => {
           console.error('アップロード失敗', error);
         });
       
       
       //データベース登録
       firebase
         .database()
         .ref(`campbook/${this.currentUid}`).push({
           campsitename: this.campsiteName,
           campsiteurl: this.campsiteUrl,
           campsitetel: this.campsiteTel,
           fromcampdate: this.fromCampDate,
           tocampdate: this.toCampDate,
           campimagelocation: `files/${this.fileName}`,
           createdAt: firebase.database.ServerValue.TIMESTAMP,
         });
         
       //詳細画面を開く  
       this.openDetailPage();
       
       //データ取り出し・表示
       firebase.database().ref(`campbook/${this.currentUid}`)
         .on('child_added', (snapshot) => {
           this.campTitle = snapshot.child('campsitename').val();
           this.campUrl = snapshot.child('campsiteurl').val();
           this.campTel = snapshot.child('campsitetel').val();
           this.fromDate = snapshot.child('fromcampdate').val();
           this.toDate = snapshot.child('tocampdate').val();
           this.campImageLocation = snapshot.child('campimagelocation').val();
         });
         
       firebase.database().ref(`campbook/${this.currentUid}`)
         .off('child_added');
     },
     
   },
   mounted() {
     firebase.auth().onAuthStateChanged((user) => {
       if (user) {
         console.log('login', user.uid);
         
         this.currentUid = user.uid;
         this.nouser = false;
         
         // firebase.database().ref(`campbook/${user.uid}`).on('value', (snapshot) => {
         //   const data = snapshot.val();
         //   console.log(data)
         //   this.campData = data
         // });
       } else {
         console.log('logout');
         this.nouser = true;
       }
     });
   }
 });
 
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
 */
 
 });
 
 
 