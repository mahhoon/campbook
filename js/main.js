/**
 * 認証部分
 **/
 
import {loginModal} from "./loginModal.js";
import {signupModal} from "./signupModal.js";


//GoogleMaps
const gMap = (currentCampAdress) => {
  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({
    address: currentCampAdress
  },(results, status) => {
  
    const resultLocation = results[0].geometry.location;
    
    const mapArea = document.getElementById('maparea')
    let map;
    if (results[0]) {
      map = new window.google.maps.Map(mapArea, {
        center: resultLocation,
        zoom: 10
      });
      new window.google.maps.Marker({
        position: resultLocation,
        map: map,
        animation: window.google.maps.Animation.DROP
      })
    } else {
      alert('No results found')
      return;
    }
  });
}

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

// //キャンプ一覧
// const campCards = {
//   template: `
//   <ul class="campcards-wrap container" v-on:click="godetailpage">
//     <li class="campcard" v-for="(value, key) in campdatafromparent">
//         <img v-bind:src="value.downloadcampimage">
//         <div class="campcard__text">
//             <p class="campcard__place">{{value.campsitename}}</p>
//             <p class="campcard__data">{{value.fromcampdate}}〜{{value.tocampdate}}</p>
//         </div>
//     </li>
//   </ul>
//   `,
//   props: {
    
    
//   },
//   methods: {

//   },
//   data: {
    
//   }
// }

 
/**
 * インスタンス
 */

new Vue({
  el: '#app',
  components: {
    'login-modal': loginModal,
    'signup-modal': signupModal,
    'footer-wrap': footerWrap,
    // 'camp-cards': campCards
  },
  data: {
    //表示関連
    loginModalShow: false,
    signupModalShow: false,
    nouser: true,
    user: false,
    usertop: true,
    registCampModalShow: false,
    camppage: false,
    newCamp: true,
    editCamp: false,
    isActive: false,
    togglemenu: 'togglemenu',
    sp: 'sp',
    //ユーザー関連
    currentUid: '',
    currentUname: '',
    //画像保存
    uploadFile: null,
    fileName: '',
    deletImage: '',
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
    //機能群

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
      this.newCamp = true;
      this.editCamp = false;
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
    },
    goUserIndex() {
      this.camppage = false;
      this.usertop = true;
    },
    openDetailPage() {
      this.camppage = true;
      this.registCampModalShow = false;
      this.usertop = false;
    },
    showToggleMenu() {
      this.isActive = !this.isActive;
    },

    //画像セレクト
    selectedFile(e) {
      e.preventDefault();
      let files = e.target.files;
      this.uploadFile = files[0];
      this.fileName = this.uploadFile.name;
    },
    
    //キャンプ登録
    registCampdata() {
      
      //画像ファイルアップ
      firebase
        .storage()
        .ref(`${this.currentUid}/${this.fileName}`)
        .put(this.uploadFile)
        .then(()=>{
          firebase
            .storage()
            .ref(`${this.currentUid}/${this.fileName}`)
            .getDownloadURL()
            
            .then ((url) => {
              this.campRegisterData.downloadCampImage = url;
              console.log(url);
              
              //データベース登録
              firebase
                .database()
                .ref(`campbooks/${this.currentUid}`).push({
                  ...this.campRegisterData,
                  campimagelocation: `${this.currentUid}/${this.fileName}`,
                  createdAt: firebase.database.ServerValue.TIMESTAMP,
                });
            });

        })
        .catch((error) => {
          console.error('アップロード失敗', error);
        });
      
      //詳細画面を開く  
      this.openDetailPage();
      gMap(this.campRegisterData.campsiteName);
    },
    
    //サムネイルから詳細画面へ
    expandPage(value, key) {
      this.openDetailPage();
      this.campDetailData = value;
      this.currentCampId = key;
      
      gMap(this.campDetailData.campsiteName);

    },
    
    
    //詳細画面でキャンプデータを削除する
    deleteCampData(currentCampId) {
      //削除する画像を格納
      firebase
        .database().ref(`campbooks/${this.currentUid}/${this.currentCampId}/campimagelocation`)
        .on('value', (snapshot) => {
          this.deleteImage = snapshot.val();
          console.log(this.deleteImage);
        })

      const resultDelete = window.confirm('削除しますか？');
      // if (resultDelete) {
      //   firebase.storage().ref().child(this.deleteImage).delete()
      //     .then(() => {
      //       firebase.database().ref(`campbooks/${this.currentUid}/${this.currentCampId}`)
      //         .remove()
      //         .then(() => {
      //           this.goUserIndex();
      //         })
      //         .catch(()=> {
      //           console.error()
      //         })
      //     })


      if (resultDelete) {

        firebase.storage().ref(`${this.deleteImage}`).delete()
          .then(() => {
            firebase.database().ref(`campbooks/${this.currentUid}/${this.currentCampId}`)
              .remove()
              .then(() => {
                this.goUserIndex();
              })
              .catch(()=> {
                console.error()
              })
          })
        // firebase.database().ref(`campbooks/${this.currentUid}/${this.currentCampId}`)
        //   .remove()
        //   .then(() => {
        //     firebase.storage().ref(`'${this.deleteImage}'`).delete()
        //       .then(()=>{
        //         this.goUserIndex();
        //       })
        //       .catch(()=> {
        //         console.error()
        //       })
        //   });
      }
    },
    
    //行程を編集
    editCampModalShow() {
      this.registCampModalShow = true;
      this.editCamp = true;
      this.newCamp = false;
      // this.campRegisterData = this.campDetailData
      this.campRegisterData = {...this.campDetailData};
    },
    editCampData() {
      firebase.database().ref(`campbooks/${this.currentUid}/${this.currentCampId}`).update({
        ...this.campRegisterData
      });
      this.campDetailData = this.campRegisterData;
      
      this.registCampModalShow = false;
      
    },
    setUserName(name) {
      console.log(name)
      this.currentUname = name
    }
  },
  

  
  
  
  
  //読み込み時
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('login', user);
        
        this.currentUid = user.uid;
        this.nouser = false;
        this.user = true;
        
        //通常のログイン時
        if (user.displayName !== null) {
          this.currentUname = user.displayName;
        }
        
        console.log(this.currentUname)
        
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
        this.user = false;
      }
    });
  }

  
});






//jQuery

$(function(){
  // //ハンバーガーメニュー ->vueで実装
  // $('.togglebtn').on('click', () => {
  //   $('.togglemenu').toggleClass('togglemenu-show');
  // });



  //アコーディオン
  //ページ読み込み時の要素を指定したいのでセレクタにbody,第二引数に要素を入れています

  $('body').on('click', '.campcontent_menubar', (e) => {
    $(e.target).next().slideToggle(200);
    $(e.target).toggleClass('close',200);
  });
  

  //スクロールに合わせてふわっと出す
  /*  
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


