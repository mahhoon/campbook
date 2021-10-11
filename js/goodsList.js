//詳細ページの持ち物リスト部分
export const goodsList = {
    template: `
    <div class="contentarea">
        <div class="add-basiclist" v-on:click="importUserGoodsList">基本の持ち物リストを読み込む</div>
        <div class="goodslists__contentarea">
            <div class="goodslists__contentarea__categoryunit"  v-for="(value, key) in campGoods">
                <div class="goodslists__contentarea__categoryunit-category-name">{{value.goodsCategory}}</div>
                <div>
                    <ul>
                        <li class="goodslist" v-for="(item, itemkey) in value.goodsItems">
                            <label class="checkbox-car">
                                <input type="checkbox" class="checkbox-car-input">
                                <span class="goodscheckbox-dummyinput-car"></span>
                            </label>
                            <label class="checkbox-circle">
                                <input type="checkbox" class="checkbox-circle-input">
                                <span class="goodscheckbox-dummyinput-circle"></span>
                            </label>
                            <span class="goodslist__name">{{item.goodsItemName}}</span>
                            <span class="goodslist__delete">削除</span>
                        </li>
                    </ul>
                    <div class="addlistarea">
                        <input type="text" class="addlisttext" placeholder="新しいアイテムを追加" v-model="inputGoodsName">
                        <span class="addlistbtn_s" v-on:click="addGoods(key)"></span>
                    </div>
                </div>
            </div>
        </div> 
    </div>
    `,

    data() {
        return {
            userGoods: '',
            inputGoodsName: '',
            //campGoods: '',
        }
    },

    methods: {
        importUserGoodsList() {
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
        },

        addGoods(key) {
            if (this.inputGoodsName.length !== 0){
                firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}/${key}/goodsItems`).push({
                    goodsItemName: this.inputGoodsName,
                    checkboxCar: false,
                    checkboxStuff: false,
                })
            this.inputGoodsName =  ''; 
            } else {
                return;
            }
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