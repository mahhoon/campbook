/**
 * 認証部分
 **/
import {loginModal} from "./loginModal.js";
import {signupModal} from "./signupModal.js";

//OpenWeatherMap
const apiKey = '28f6fef487aab69f58982d60c1b8f9e0';
import taranslateJp from "./forecastTranslate.js";

//Sortable.js
const goodsBasicLists = document.getElementById('goodsbasiclists');
console.log(goodsBasicLists);
//Sortable.create(goodsBasicLists);

/**
 * todo追加
 */
import {todoList} from "./todoList.js";
/**
 * 持ち物リスト作成ページ追加
 */
import {basicGoodsLists} from "./userGoodsLists.js";

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

//ユーザーヘッダー
import { userHeader } from "./userHeader.js";
 
/**
 * インスタンス
 */

new Vue({
  el: '#app',
  components: {
    'login-modal': loginModal,
    'signup-modal': signupModal,
    'footer-wrap': footerWrap,
    'todo-list': todoList,
    'user-header': userHeader,
    'basic-goods-lists': basicGoodsLists,
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
    usergoodslists: false,
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
    //天気予報
    forecastdata: {
      resultLocationLat: '',
      resultLocationLng: '',
      description: '',
      temphigh: '',
      templow: '',
      day: '',
      icon: '',
    },
    forecast3days: [],
    //TODO
    todoItems: '',
  },

  methods: {
  /*
  表示切り替え
  */
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
      };
      //input="file"の値をクリア
      this.$refs.selectedFileInput.value = null;
    },
    closeNewcampModal() {
      this.registCampModalShow = false;
    },
    goUserIndex() {
      this.camppage = false;
      this.usertop = true;
      this.usergoodslists = false;
    },
    openDetailPage() {
      this.forecast3days = [];
      this.camppage = true;
      this.registCampModalShow = false;
      this.usertop = false;
    },
    showToggleMenu() {
      this.isActive = !this.isActive;
    },
    showUserGoodsLists() {
      this.usergoodslists = true;
      this.usertop = false;
    },

    //画像セレクト
    selectedFile(e) {
      e.preventDefault();
      let files = e.target.files;
      this.uploadFile = files[0];
      this.fileName = this.uploadFile.name;
      console.log(e);
    },
    
    //キャンプ登録
    registCampdata() {
      const pushDatabase = () =>{
        firebase
        .database()
        .ref(`campbooks/${this.currentUid}`).push({
          ...this.campRegisterData,
          campimagelocation: `${this.currentUid}/${this.fileName}`,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      //画像ファイルが選択されてたら、画像を登録する
      if (this.fileName.length !== 0) {
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
              pushDatabase();
            });

        })
      .catch((error) => {
        console.error('アップロード失敗', error);
      });
      } else {
        //画像なしでデータベース登録
        pushDatabase();
      }

      //新規登録モーダルを閉じる
      this.closeNewcampModal();
    },

  /*
  サムネイルから詳細画面へ
  */
    expandPage(value, key) {
      this.openDetailPage();
      this.campDetailData = value;
      this.currentCampId = key;
      //todoのデータをfirebaseから取得
      firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
        .off('value');
      firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
        .on('value', (snapshot) => {
            console.log('value', snapshot.val())
            this.todoItems = snapshot.val();
            console.log(this.todoItems)
        });
      
      //GoogleMaps & OpenWeatherMap
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({
        address: this.campDetailData.campsiteName
      },(results, status) => {
        console.log(results);
        //座標を取得
        const resultLocation = results[0].geometry.location;
        //緯度
        this.resultLocationLat = results[0].geometry.location.lat();
        //軽度
        this.resultLocationLng = results[0].geometry.location.lng();

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

        //天気予報
        console.log(this.resultLocationLat);
        console.log(this.resultLocationLng);
        const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${this.resultLocationLat}&lon=${this.resultLocationLng}&units=metric&appid=${apiKey}&lang=ja`

        axios.get(forecastUrl)
          .then((res) => {
            for (let i = 1; i < 4; i++) {
            const resAll = res.data;
            console.log(resAll);
            this.forecastdata.description = taranslateJp[res.data.daily[i].weather[0].id][0];
            this.forecastdata.temphigh = Math.round(res.data.daily[i].temp.max);
            this.forecastdata.templow = Math.round(res.data.daily[i].temp.min);
            this.forecastdata.icon = taranslateJp[res.data.daily[i].weather[0].id][1];

            //日付、時間を取得（Dateがミリ秒なので1000倍が必要）
            const date = new Date(res.data.daily[i].dt * 1000);
            //UTCとの時差をなくす（日本は-9時間なので9をたす）
            date.setHours(date.getHours() + 9);
            //月を取得。getMonth()は0-11を返すため1を足す
            const month = date.getMonth() + 1;
            //曜日を日本語変換するための配列
            const week = ['（日）','（月）','（火）','（水）','（木）','（金）','（土）'];
            //月＋日＋曜日をdayに代入。getDay()は0-6を返すため、曜日の配列に応じた日本語曜日が入る
            this.forecastdata.day = month + '/' + date.getDate() + week[date.getDay()];

            //3日分の配列を作る
            this.forecast3days.push(
              {day: this.forecastdata.day,
              description: this.forecastdata.description,
              temphigh: this.forecastdata.temphigh,
              templow: this.forecastdata.templow,
              icon: `img/weathericon/${this.forecastdata.icon}`}
              )
            }
          })
          .catch(() => {
            alert('天気予報の取得に失敗しました')});
            
          console.log(this.forecast3days);
      });

    },
    
    //詳細画面でキャンプデータを削除する
    deleteCampData() {
      const resultDelete = window.confirm('削除しますか？');

      if (resultDelete) {
            firebase.database().ref(`campbooks/${this.currentUid}/${this.currentCampId}`)
              .remove()
              .then(() => {
                this.goUserIndex();
              })
              .catch(()=> {
                console.error()
              })
      }
    },
    
    //行程を編集
    editCampModalShow() {
      this.registCampModalShow = true;
      this.editCamp = true;
      this.newCamp = false;
      // this.campRegisterData = this.campDetailDataだと参照渡しになるので、展開して入れる
      this.campRegisterData = {...this.campDetailData};
      //$refsでコンポーネント内のDOM要素を直接参照できる
      this.$refs.selectedFileInput.value = null;
    },
    editCampData() {
      //画像ファイルが選択されてたら、画像を登録する
      if (this.fileName.length !== 0) {
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
              firebase.database().ref(`campbooks/${this.currentUid}/${this.currentCampId}`).update({
                ...this.campRegisterData,
                campimagelocation: `${this.currentUid}/${this.fileName}`
              });
              this.campDetailData = this.campRegisterData;
            });
        })
      .catch((error) => {
        console.error('アップロード失敗', error);
      });
      } else {
        //画像なしでデータベース登録
        firebase.database().ref(`campbooks/${this.currentUid}/${this.currentCampId}`).update({
          ...this.campRegisterData,
          campimagelocation: `${this.currentUid}/${this.fileName}`
        });
        this.campDetailData = this.campRegisterData;
      }
      
      this.registCampModalShow = false;
      
    },

    setUserName(name) {
      console.log(name)
      this.currentUname = name
    }
  },
  
  
  
  
  
  /*
  読み込み時
  */
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
        
        //データ取り出し・表示　　←これいらないかも？！
        //二重にイベントハンドラが登録されないように
        // firebase.database().ref(`campbooks/${this.currentUid}`)
        //   .off('child_added');
          
        // firebase.database().ref(`campbooks/${this.currentUid}`)
        //   .on('child_added', (snapshot) => {
        //     this.campDetailData = snapshot.val();
        //     console.log(this.campDetailData)
        //   });

        //全てのデータ
        firebase.database().ref(`campbooks/${user.uid}`)
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
  $('body').on('click', '.usergoodslists__contentarea__main_categoryunit-categoryname', (e) => {
    $(e.target).next().slideToggle(200);
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


