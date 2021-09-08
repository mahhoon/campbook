//registTodoコンポーネント
export const todoList = {
    template: `
    <div class="contentarea">
        <ul id="todolist">
            <li class="todolist__item" v-for="(value, key) in todoItems">
                <label>
                    <input type="checkbox" v-model="value.isChecked">
                    <span>{{value.title}}</span>
                </label>
                <span class="todolist__delete"　v-on:click="deleteTodo(key)">削除</span>
            </li>
        </ul>
        <div class="addtodoarea">
            <input type="text" class="addtodotext" v-model="inputTodotitle">
            <span class="addtodobtn" v-on:click="addTodo"><i class="fas fa-plus-circle"></i></span>
        </div> 
    </div>
    `,

    data() {
        return {
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

            firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
                .on('child_added', (snapshot) =>{
                    this.todoItems = snapshot.val();
                    console.log(this.todoItems)
                })

            this.inputTodotitle = '';
            } else {
                return;
            }
        },

        deleteTodo(key){
            firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}/key`)
                .remove()
                .then(() => {

                })
        },

        //だめだった・・
        // mounted(){
        //     //todoのデータをfirebaseから取得
        //         firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
        //             .on('value', (snapshot) =>{
        //                 this.todoItems = snapshot.val();
        //         console.log(this.todoItems)
        //         });
        // }

    },

    props: ['currentCampId', 'currentUid', 'todoItems'],
    // 'todoItems'

    // created() {
    //     firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
    //                 .on('value', (snapshot) =>{
    //                     this.todoItems = snapshot.val();
    //                 })
    // }
}