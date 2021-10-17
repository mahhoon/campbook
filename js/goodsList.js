import {addCampGoodsItem} from "./addCampGoodsItem.js";

//詳細ページの持ち物リスト部分
export const goodsList = {
    template: `
    <div class="contentarea">
        <div class="add-basiclist" v-on:click="importUserGoodsList">基本の持ち物リストを読み込む/リセットする</div>
        <div class="goodslists__contentarea">
            <div v-show="noUserBasicgoodslist" class="no-user-basicgoods-list">
                <P v-on:click="showUserGoodsListsFromChild"><span class="icon"><i class="fas fa-exclamation-circle"></i></span>基本の持ち物リストを作成してください</P>
            </div>
            <div class="goodslists__contentarea__categoryunit"  v-for="(value, key) in campGoods">
                <div class="goodslists__contentarea__categoryunit-category-name">{{value.goodsCategory}}</div>
                <div>
                    <ul>
                        <li class="goodslist" v-for="(item, itemkey) in value.goodsItems">
                            <label class="checkbox-car">
                                <input type="checkbox" class="checkbox-car-input" v-on:click="checkCar(item, key, itemkey)" v-model="item.checkboxCar">
                                <span class="goodscheckbox-dummyinput-car"></span>
                            </label>
                            <label class="checkbox-circle">
                                <input type="checkbox" class="checkbox-circle-input" v-on:click="checkStuff(item, key, itemkey)" v-model="item.checkboxStuff">
                                <span class="goodscheckbox-dummyinput-circle"></span>
                            </label>
                            <span class="goodslist__name">{{item.goodsItemName}}</span>
                            <span class="item__delete" v-on:click="deleteGoods(key, itemkey)">削除</span>
                        </li>
                    </ul>
                    <add-camp-goods-item v-bind:current-category-key="currentCategoryKey" v-bind:current-uid="currentUid" v-bind:current-camp-id="currentCampId" v-on:inform-focus="getKey(key)"></add-camp-goods-item>
                </div>
            </div>
        </div> 
    </div>
    `,
    components: {
        'add-camp-goods-item': addCampGoodsItem,
    },
    
    data() {
        return {
            userGoods: '',
            //goodsItemName: '',
            //campGoods: '',
            currentCategoryKey: '',
            noUserBasicgoodslist: false
        }
    },

    methods: {
        importUserGoodsList() {
            const resultreset = window.confirm('持ち物リストをリセットしますか？');

            if (resultreset) {
                    firebase.database().ref(`basicgoods/${this.currentUid}`)
                        .on('value',(snapshot) =>{
                            this.userGoods = snapshot.val();
                            console.log(this.userGoods);
                    });
                    if (this.userGoods == null) {
                        this.noUserBasicgoodslist = true;
                        firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}`)
                        .set(this.userGoods);
                    } else {
                        this.noUserBasicgoodslist = false;
                        firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}`)
                        .set(this.userGoods);
                    }
            } else {
                return;
            }

        },

        showUserGoodsListsFromChild(){
            this.$emit('show-user-goods-lists');
        },

        //インプットエリアにkeyが乗ったら該当のkeyを取得
        getKey(key) {
            this.currentCategoryKey = key;
            console.log(this.currentCategoryKey);
        },
        
        //チェックボックス更新
        checkCar(item, key, itemkey) {
            item.checkboxCar = !item.checkboxCar
            firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}/${key}/goodsItems/${itemkey}`)
                .update({...item})
                .catch(()=> {
                    console.error("更新できませんでした")
                })
        },

        checkStuff(item, key, itemkey) {
            item.checkboxStuff = !item.checkboxStuff
            firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}/${key}/goodsItems/${itemkey}`)
                .update({...item})
                .catch(()=> {
                    console.error("更新できませんでした")
                })
        },


        //アイテム削除
        deleteGoods(key, itemkey) {
            firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}/${key}/goodsItems/${itemkey}`)
                .remove()
                .then(() =>{
                    console.log("Remove succeeded.");
                })
                .catch(() => {
                    console.error("削除できませんでした");
                })
        },
    },

    // mounted() {
    //     firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}`)
    //         .on('value',(snapshot) => {
    //             this.campGoods = snapshot.val();
    //             console.log(this.campGoods);
    //         })
    // },

    props: ['currentUid','currentCampId','campGoods'],
}