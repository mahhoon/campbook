//registTodoコンポーネント
export const todoList = {
    template: `
    <div class="contentarea">
        <ul id="todolist">
            <li class="todolist__item" v-for="(value, key) in todoItems">
                <label class="todocheckbox">
                    <input class="todocheckbox__input" type="checkbox"　v-on:click="updateTodo(value,key)" v-model="value.isChecked">
                    <span class="todocheckbox__dummyinput"></span>
                    <span>{{value.title}}</span>
                </label>
                <span class="item__delete" v-on:click="deleteTodo(key)">削除</span>
            </li>
        </ul>
        <div class="addtodoarea">
            <input type="text" class="addlisttext" placeholder="項目を追加" v-model="inputTodotitle"  v-on:keypress.enter="addTodo">
            <span class="addlistbtn_s" v-on:click="addTodo"></span>
        </div> 
    </div>
    `,

    data() {
        return {
            // todoItems: '',
            inputTodotitle: '',
        }
    },

    methods: {
        addTodo() {
            if (this.inputTodotitle.length !== 0){
                firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`).push({
                    title: this.inputTodotitle, 
                    isChecked: false
                })
                
            //やっぱりoffする意味が分からない
            // firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
            //     .off('child_added');

            // firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
            //     .on('child_added', (snapshot) =>{
            //         this.$emit('update:value', snapshot.val());
            //     })

            this.inputTodotitle = '';
            } else {
                return;
            }
        },

        updateTodo(value,key) {
            value.isChecked = !value.isChecked
            firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}/${key}`)
                .update({...value})
                .catch(()=> {
                    console.error("更新できませんでした")
                })
        },

        deleteTodo(key){
            firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}/${key}`)
                .remove()
                .then(() => {
                    console.log("Remove succeeded.");
                })
                .catch(()=> {
                    console.error("削除できませんでした")
                })
        },
    },

    //データは取れるけど、表示されない・・
    // mounted(){
    //     //todoのデータをfirebaseから取得
    //         firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
    //             .on('value', (snapshot) => {
    //                 this.todoItems = snapshot.val();
    //         console.log(this.todoItems)
    //         });
    // },

    props: ['currentCampId', 'currentUid', 'todoItems'],
}