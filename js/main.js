/**
 * 認証部分
 **/
 
 import {loginModal} from "./loginModal.js";
 import {signupModal} from "./signupModal.js";
 
 
 /**
  * 表示パーツ
  */
 
 //フッター
 const footerWrap = {
   template: `
   <footer class="container">
        <p>&copy; luonto 2021</p>
   </footer>
   `
 };
 
 //キャンプ一覧
 const campCards = {
   template: `
   <ul class="campcards-wrap container" v-on:click="godetailpage">
     <li class="campcard" v-for="(value, key) in campdatafromparent">
         <img v-bind:src="value.downloadcampimage">
         <div class="campcard__text">
             <p class="campcard__place">{{value.campsitename}}</p>
             <p class="campcard__data">{{value.fromcampdate}}〜{{value.tocampdate}}</p>
         </div>
     </li>
   </ul>
   `,
   props: {
     
     
   },
   methods: {
 
   },
   data: {
     
   }
 }
 
  
 /**
  * インスタンス
  */
 
 new Vue({
   el: '#app',
   components: {
     'login-modal': loginModal,
     'signup-modal': signupModal,
     'footer-wrap': footerWrap,
     'camp-cards': campCards
   },
   data: {
     //表示関連
     loginModalShow: false,
     signupModalShow: false,
     nouser: '',
     usertop: true,
     registCampModalShow: false,
     camppage: false,
     editCampModalShow: false,
     //ユーザー関連
     currentUid: '',
     //画像保存
     uploadFile: null,
     fileName: '',
     //登録データオブジェクト
     campData: '',
     campRegisterData: {
       campsiteName: '',
       campsiteUrl: '',
       campsiteTel: '',
       fromCampDate:'',
       toCampDate:'',
       downloadCampImage: '',
     },
     campDetailData: {
       campsiteName: '',
       campsiteUrl: '',
       campsiteTel: '',
       fromCampDate:'',
       toCampDate:'',
       downloadCampImage: '',
     },
     currentCampId: '',
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
       this.campRegisterData = {
         campsiteName: '',
         campsiteUrl: '',
         campsiteTel: '',
         fromCampDate:'',
         toCampDate:'',
         downloadCampImage: '',
       }
     },
     closeNewcampModal() {
       this.registCampModalShow = false;
       this.editCampModalShow = false
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
               this.campRegisterData.downloadCampImage = url;
               console.log(url);
               
               //データベース登録
               firebase
                 .database()
                 .ref(`campbooks/${this.currentUid}`).push({
                   ...this.campRegisterData,
                   campimagelocation: `files/${this.fileName}`,
                   createdAt: firebase.database.ServerValue.TIMESTAMP,
                 });
             });
 
         })
         .catch((error) => {
           console.error('アップロード失敗', error);
         });
       
       //詳細画面を開く  
       this.openDetailPage();
     },
     
     //サムネイルから詳細画面へ
     expandPage(value, key) {
       this.openDetailPage();
       this.campDetailData = value;
       this.currentCampId = key;
     },
     
     //詳細画面でキャンプデータを削除する
     deleteCampData(currentCampId) {
       const resultDelete = window.confirm('削除しますか？');
       if (resultDelete) {
         firebase.database().ref(`campbooks/${this.currentUid}/${this.currentCampId}`)
           .remove()
           .then(() => {
             this.goUserIndex();
           });
       }
     },
     
     //行程を編集
     editCampData(){
       this.editCampModalShow = true;
       // this.campRegisterData = this.campDetailData
       this.campRegisterData = {...this.campDetailData}
       
       firebase.database().ref(`campbooks/${this.currentUid}/${this.currentCampId}`).update({
         ...this.campRegisterData
       })
     }
     
   },
   mounted() {
     firebase.auth().onAuthStateChanged((user) => {
       if (user) {
         console.log('login', user.uid);
         
         this.currentUid = user.uid;
         this.nouser = false;
         
         //データ取り出し・表示
         //二重にイベントハンドラが登録されないように
         firebase.database().ref(`campbooks/${this.currentUid}`)
           .off('child_added');
           
         firebase.database().ref(`campbooks/${this.currentUid}`)
           .on('child_added', (snapshot) => {
             this.campDetailData = snapshot.val();
             console.log(this.campDetailData)
           });
 
         //全てのデータ
         firebase.database().ref(`campbooks/${user.uid}`).orderByChild('fromCampDate')
           .on('value', (snapshot) => {
             this.campData = snapshot.val();
             console.log(this.campData)
           });
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
 
 
 