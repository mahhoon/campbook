import {addGoodsItem} from "./addGoodsItem.js";

//詳細ページの持ち物リスト部分
export const goodsList = {
    template: `
    <div class="contentarea">
        <div class="add-basiclist" v-on:click="importUserGoodsList">基本の持ち物リストを読み込む/リセットする</div>
        <div class="goodslists__contentarea">
            <div class="goodslists__contentarea__categoryunit"  v-for="(value, key) in campGoods">
                <div class="goodslists__contentarea__categoryunit-category-name">{{value.goodsCategory}}</div>
                <div>
                    <ul>
                        <li class="goodslist" v-for="(item, itemkey) in value.goodsItems">
                            <label class="checkbox-car">
                                <input type="checkbox" class="checkbox-car-input" v-on:click="checkCar(item, key, itemkey)">
                                <span class="goodscheckbox-dummyinput-car"></span>
                            </label>
                            <label class="checkbox-circle">
                                <input type="checkbox" class="checkbox-circle-input" v-on:click="checkStuff(item, key, itemkey)">
                                <span class="goodscheckbox-dummyinput-circle"></span>
                            </label>
                            <span class="goodslist__name">{{item.goodsItemName}}</span>
                            <span class="goodslist__delete" v-on:click="deleteGoods(key, itemkey)">削除</span>
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
            userGoods: '',
            goodsItemName: '',
            //campGoods: '',
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
            firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}`)
                .set(this.userGoods);

            //データを取る
            // firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}`)
            //     .on('value',(snapshot) => {
            //         this.campGoods = snapshot.val();
            //         console.log(this.campGoods);
            //     })
            }
        },

        //アイテム追加の入力値受け取る
        getInputGoods(goodsinput) {
            this.goodsItemName = goodsinput;
            console.log(this.goodsItemName);
        },

        //アイテム追加
        addGoods(key) {
            if (this.goodsItemName.length !== 0){
                firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}/${key}/goodsItems`).push({
                    goodsItemName: this.goodsItemName,
                    checkboxCar: true,
                    checkboxStuff: true,
                })
            this.goodsItemName =  ''; 
            } else {
                return;
            }
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