//registTodoコンポーネント
export const todoList = {
    template: `
    <div class="contentarea">
        <ul id="todolist">
            <li class="todolist__item" v-for="todoItem in todoItems">
                <label>
                    <input type="checkbox" v-model="todoItem.isChecked">
                    <span>{{todoItem.title}}</span>
                </label>
                <span class="todolist__delete"　v-on:click="deleteTodo">削除</span>
            </li>
        </ul>
        <div class="addtodoarea">
            <input type="text" class="addtodotext" v-model="inputTodotitle">
            <span class="addtodobtn" v-on:click="addTodo"></span>
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
            firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`).push({
                title: this.inputTodotitle, 
                isChecked: false
            })
            //やっぱりoffする意味が分からない
            // firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
            //     .off('child_added');

            firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
                .on('child_added', (snapshot) =>{
                    this.todoItems= snapshot.val();
                    console.log(this.todoItems)
                });
            this.inputTodotitle = '';
        },

        deleteTodo(){
            firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
        }
    },

    props: ['currentCampId', 'currentUid', 'todoItems'],

    // created() {
    //     firebase.database().ref(`camptodos/${this.currentUid}/${this.currentCampId}`)
    //                 .on('value', (snapshot) =>{
    //                     this.todoItems = snapshot.val();
    //                 })
    // }
}