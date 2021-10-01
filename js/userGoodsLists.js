//うちの持ち物基本リスト
export const basicGoodsLists = {
    template: `
    <div class="usergoodslists__contentarea">
        <p class="usergoodslists__contentarea-backbtn" v-on:click="goUserIndexFromChild"><span class="icon"><i class="fas fa-arrow-circle-left"></i></span>キャンプ一覧に戻る</p>
        <div class="usergoodslists__contentarea__heading">
            <h1>うちの持ち物リストを作成</h1>
            <div class="usergoodslists__contentarea__heading-addcategory">
                <input type="text" class="addlisttext addlisttext-short"　placeholder="新しいカテゴリーを追加" v-model="goodsCategoryName">
                <span class="addlistbtn" v-on:click="registGoodsCategory"></span>
            </div>
        </div>
        <div class="usergoodslists__contentarea__main">
            <div class="usergoodslists__contentarea__main_categoryunit" v-for="(value, key) in userGoods">
                <div class="usergoodslists__contentarea__main_categoryunit-categoryname">{{value.goodsCategory}}<i class="fas fa-backspace deletebtn"></i></div>
                    <div>
                        <ul id="goodsbasiclists">
                            <li class="goods-basic-list"　v-for="(item, itemkey) in value.goodsItems">{{item.goodsItemName}}<i class="fas fa-backspace deletebtn"></i></li>
                        </ul>
                        <div class="adduserlistarea">
                            <input type="text" class="addlisttext addlisttext-color" placeholder="新しいアイテムを追加" v-model="goodsItemName">
                            <span class="addlistbtn_s" v-on:click="addGoods(key)"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            goodsCategoryName: '',
            goodsItemName: '',
            currentCategory: '', //今いるカテゴリKeyを入れる
            userGoods: '',　//databaseのアイテムのsnapshotを格納
            checkboxCar: false,
            checkboxStuff: false,
        }
    },

    methods: {
        //一覧へ戻るボタンのイベント発火を親に伝える
        goUserIndexFromChild() {
            this.$emit('go-user-index-from-child');
        },
        //カテゴリー登録
        registGoodsCategory() {
            if (this.goodsCategoryName.length !== 0) {
                firebase.database().ref(`basicgoods/${this.currentUid}`).push({
                    goodsCategory: this.goodsCategoryName, 
                })

            this.goodsCategoryName = '';
            } else {
                return;
            }
        },
        //アイテム登録
        addGoods(key) {
            this.currentCategory = key;
            if (this.goodsItemName.length !== 0) {
                firebase.database().ref(`basicgoods/${this.currentUid}/${this.currentCategory}/goodsItems`).push({
                    goodsItemName: this.goodsItemName, 
                    checkboxCar: this.checkboxCar,
                    checkboxStuff: this.checkboxStuff,
                })

            this.goodsItemName = '';
            } else {
                return;
            }
        }
    },

    mounted() {
        firebase.database().ref(`basicgoods/${this.currentUid}`)
            .on('value',(snapshot) => {
                this.userGoods = snapshot.val();
                console.log(this.userGoods);
            });

        //Sortable.js　※ループ内のIDは取れない
        // const goodsBasicLists = document.getElementById('goodsbasiclists');
        // console.log(goodsBasicLists);
        // Sortable.create(goodsBasicLists);
    },

    props: ['currentUid'],
}