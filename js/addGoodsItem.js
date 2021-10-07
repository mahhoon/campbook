//持ち物基本リストカテゴリーごと
export const addGoodsItem = {
    template: `
    <div class="adduserlistarea">
        <input type="text" class="addlisttext addlisttext-color" placeholder="新しいアイテムを追加" v-model="goodsItemInput" v-on:change="goodsInputed">
        <span class="addlistbtn_s" v-on:click="addGoodsFromChild"></span>
    </div>
    `,

    data() {
        return {
            goodsItemInput: '',
        }
    },
    
    methods: {
        goodsInputed(){
            this.$emit('pass-input-goods', this.goodsItemInput);
        },
        addGoodsFromChild() {
            this.$emit('add-goods-from-child');
            //親のデータを参照する
            this.goodsItemInput = this.$parent.goodsItemName;
        },
    },
}