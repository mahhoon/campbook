//持ち物基本リストカテゴリーごと
export const addCampGoodsItem = {
    template: `
    <div class="addlistarea" v-on:mouseover="goodsInputedFocus">
        <input type="text" class="addlisttext addlisttext-color" placeholder="新しいアイテムを追加" 
            v-model="goodsItemInput" v-on:keypress.enter="addGoods">
        <span class="addlistbtn_s"　v-on:click="addGoods"></span>
    </div>
    `,

    data() {
        return {
            goodsItemInput: '',
        }
    },
    
    methods: {
        goodsInputedFocus(){
            this.$emit('inform-focus');
        },
        // addGoodsFromChild() {
        //     this.$emit('add-goods-from-child');
        //     //親のデータを参照する
        //     this.goodsItemInput = this.$parent.goodsItemName;
        // },
        addGoods() {
            if (this.goodsItemInput.length !== 0) {
                firebase.database().ref(`campgoods/${this.currentUid}/${this.currentCampId}/${this.currentCategoryKey}/goodsItems`)
                    .push ({
                    goodsItemName: this.goodsItemInput, 
                    checkboxCar: false,
                    checkboxStuff: false,
                })
                this.goodsItemInput = '';
            } else {
                return;
            }
        },
    },

    props: ['currentUid', 'currentCategoryKey','currentCampId']
}