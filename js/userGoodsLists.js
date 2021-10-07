import {addGoodsItem} from "./addGoodsItem.js";

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
                <div class="usergoodslists__contentarea__main_categoryunit-categoryname">{{value.goodsCategory}}
                    <span v-on:click="deleteCategory(key)"><i class="fas fa-backspace deletebtn"></i></span>
                </div>
                <div>
                    <ul id="goodsbasiclists">
                        <li class="goods-basic-list"　v-for="(item, itemkey) in value.goodsItems">
                            {{item.goodsItemName}}
                            <span v-on:click="deleteGoods(key, itemkey)"><i class="fas fa-backspace deletebtn"></i></span>
                        </li>
                    </ul>
                    <add-goods-item v-on:pass-input-goods="getInputGoods" v-on:add-goods-from-child="addGoods(key)"></add-goods-item>
                </div>
            </div>
        </div>
    </div>
    `,

    components: {
        'add-goods-item': addGoodsItem,
    },

    data() {
        return {
            goodsCategoryName: '',
            userGoods: '',　//databaseのアイテムのsnapshotを格納
            checkboxCar: false,
            checkboxStuff: false,
            goodsItemName: '',
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
        
        //アイテム追加の入力値受け取る
        getInputGoods(goodsinput) {
            this.goodsItemName = goodsinput;
            console.log(this.goodsItemName);
        },

        //アイテム登録
        addGoods(key) {            
            if (this.goodsItemName.length !== 0) {
                firebase.database().ref(`basicgoods/${this.currentUid}/${key}/goodsItems`).push({
                    goodsItemName: this.goodsItemName, 
                    checkboxCar: this.checkboxCar,
                    checkboxStuff: this.checkboxStuff,
                })

            this.goodsItemName = '';
            } else {
                return;
            }
        },

        //アイテム削除
        deleteGoods(key, itemkey) {
            firebase.database().ref(`basicgoods/${this.currentUid}/${key}/goodsItems/${itemkey}`)
                .remove()
                .then(() =>{
                    console.log("Remove succeeded.");
                })
                .catch(() => {
                    console.error("削除できませんでした");
                })
        },

        //カテゴリー削除
        deleteCategory(key) {
            firebase.database().ref(`basicgoods/${this.currentUid}/${key}`)
                .remove()
                .then(() =>{
                    console.log("Remove succeeded.");
                })
                .catch(() => {
                    console.error("削除できませんでした");
                })
        },
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