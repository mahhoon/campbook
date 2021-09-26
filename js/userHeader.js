//userpageヘッダー
export const userHeader = {
    template: `
    <div>
        <div class="user-heading container">
            <h1 class="pc"><img src="img/logo-small.svg"></h1>
            <div class="user pc">
                <p class="username">{{ currentUname }}さん、こんにちは</p>
                <p class="logout" v-on:click="logOut">ログアウト</p>
            </div>

            <h1 class="sp"><img src="img/logo-small.svg"></h1>
            <div class="toggle-wrap sp">
                <div class="togglebtn" v-on:click="showToggleMenu">
                    <span><i class="fas fa-bars"></i></span>
                </div>
            </div>
        </div>
        <div v-bind:class="[togglemenu, {'togglemenu-show':isActive}, sp]">
            <p class="non-active"><span class="icon"><i class="fas fa-check-circle"></i></span>持ち物リストの編集</p>
            <p class="non-active"><span class="icon"><i class="fas fa-camera"></i></span>写真投稿</p>
            <p v-on:click="logOut"><span class="icon"><i class="fas fa-sign-out-alt"></i></span>ログアウト</p>
        </div>
    </div>
    `,
    
    data() {
        return {
            isActive: false,
            togglemenu: 'togglemenu',
            sp: 'sp',
        }
    },

    methods: {
        logOut() {
            firebase.auth().signOut();
          },
            showToggleMenu() {
                this.isActive = !this.isActive;
          },
    },

    props: ['currentUname']
}