//bookmarksコンポーネント
export const bookmarks = {
    template: `
    <div class="contentarea">
        <ul id="bookmarks">
            <li class="bookmarks__item" v-for="(value, key) in campBookmarks">
                <span class="bookmark__item-title">{{value.title}}</span>
                <span class="item__delete" v-on:click="deleteBookmark(key)">削除</span>
                <a class="bookmark__item-url" v-bind:href="value.url" target="_blank">{{value.url}}<span class="icon"><i class="fas fa-external-link-alt"></i></span></a>
            </li>
        </ul>
        <div class="addbookmarkarea">
            <div class="inputarea">
                <input type="text" class="addbookmarktitle addlisttext" placeholder="タイトル" v-model="inputBookmarkTitle">
                <input type="text" class="addbookmarkurl addlisttext" placeholder="URL" v-model="inputBookmarkUrl">
            </div>
            <span class="addlistbtn_s" v-on:click="addBookmark"></span>
        </div> 
    </div>
    `,

    data() {
        return {
            inputBookmarkUrl: '',
            inputBookmarkTitle: ''
        }
    },

    methods: {
        addBookmark() {
            if (this.inputBookmarkUrl.length !== 0 && this.inputBookmarkTitle.length !== 0){
                firebase.database().ref(`campbookmarks/${this.currentUid}/${this.currentCampId}`).push({
                    title: this.inputBookmarkTitle,
                    url: this.inputBookmarkUrl,
                })

                this.inputBookmarkTitle = '';
                this.inputBookmarkUrl = '';
            } else {
                return;
            }
        },

        deleteBookmark(key){
            firebase.database().ref(`campbookmarks/${this.currentUid}/${this.currentCampId}/${key}`)
                .remove()
                .then(() => {
                    console.log("Remove succeeded.");
                })
                .catch(()=> {
                    console.error("削除できませんでした")
                })
        },
    },

    props: ['currentCampId', 'currentUid', 'campBookmarks'],
}