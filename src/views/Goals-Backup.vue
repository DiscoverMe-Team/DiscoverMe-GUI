<template>
  <div class="goals-application">
    <!-- Back Button -->
    <div class="columns">
      <!-- Left Column: Current Goals -->
      <div class="left-column">
        <h1>Goal Checklist</h1>

        <!-- Goal Input -->
        <div class="add-goal-container">
          <input type="text" v-model="newGoal" placeholder="Enter a new goal" />
          <button class="goal-button" @click="addGoal">Add Goal</button>
        </div>
        <div class="action-gap2"></div>
        <p v-if="showWarning" class="warning-message">You must enter a goal before adding anything to the list.</p>

        <!-- Display Goals -->
        <div v-if="goals.length > 0" class="goals">
          <div v-for="(goal, goalIndex) in goals" :key="goalIndex" class="goal">
            <div class="action-gap2"></div>
            <span class="goal-separator">******************************************************************************************************************</span>
            <div class="goal-header">
              <input class="my-checkbox" type="checkbox" @change="markGoalAsCompleted(goalIndex)" />
              <input
                type="text"
                v-model="goal.text"
                class="goal-title"
                :disabled="!goal.editing"
              />
              <button class="small-button" @click="goal.editing = !goal.editing">
                  {{ goal.editing ? "Save" : "Edit" }}
                </button>
                <div class="action-gap1"></div>
                <button class="delete-goal-button" @click="deleteGoal(goalIndex)">Delete</button>
              <div class="action-gap2"></div>
            </div>

            <!-- Task List -->
            <div v-if="goal.task.length > 0" class="task-list">
              <div v-for="(item, itemIndex) in goal.task" :key="itemIndex" class="task-item">
                <input class="my-checkbox" type="checkbox" v-model="item.completed" />
                <input type="text" v-model="item.text" class="task-input" :disabled="!item.editing" />
                <button class="smaller-button" @click="item.editing = !item.editing">
                    {{ item.editing ? "Save" : "Edit" }}
                  </button>
                  <div class="action-gap1"></div>
                  <button class="delete-task-button"  @click="deleteTaskItem(goalIndex, itemIndex)">Delete</button>
                  <div class="action-gap2"></div>
              </div>
            </div>

            <!-- Add Task Item -->
            <div class="add-task-item">
              <input
                type="text"
                v-model="goal.newTaskItem"
                placeholder="Add a task for this goal"
              />
              <button class="task-button" @click="addTaskItem(goalIndex)">Add Task</button>
            </div>
          </div>
        </div>
        <p v-else>No goals to display yet!</p>
      </div>

      <!-- Right Column: Completed Goals -->
      <div class="right-column">
        <h1>Completed Goals</h1>
        <div v-if="completedGoals.length > 0" class="completed-goals">
          <div
            v-for="(completed, index) in completedGoals"
            :key="index"
            class="completed-goal"
          >
            <div @click="toggleTaskDisplay(index)">
              <p>
                <strong>{{ completed.text }}</strong>
                <span> - Completed on {{ completed.timestamp }}</span>
              </p>
            </div>
            <ul v-if="completed.showTasks" class="completed-tasks">
              <li v-for="(task, i) in completed.task" :key="i">{{ task.text }}</li>
            </ul>
            <button class="right-delete-button" @click="deleteCompletedGoal(index)">Delete</button>
            <div class="action-gap1"></div>

          </div>
        </div>
        <p v-else>No completed goals yet!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newGoal: "",
      goals: this.loadGoalsFromLocalStorage(),
      completedGoals: this.loadCompletedGoalsFromLocalStorage(),
      showWarning: false,
    };
  },
  methods: {
    navigateToDashboard() {
      this.$router.push("/");
    },
    addGoal() {
      if (this.newGoal.trim() === "") {
        this.showWarning = true;
        setTimeout(() => (this.showWarning = false), 3000);
        return;
      }
      this.goals.push({
        text: this.newGoal,
        editing: false,
        task: [],
        newTaskItem: "",
      });
      this.newGoal = "";
      this.saveGoalsToLocalStorage();
    },
    deleteGoal(index) {
      this.goals.splice(index, 1);
      this.saveGoalsToLocalStorage();
    },
    addTaskItem(goalIndex) {
      const goal = this.goals[goalIndex];
      if (goal.newTaskItem.trim() === "") return;
      goal.task.push({ text: goal.newTaskItem, completed: false, editing: false });
      goal.newTaskItem = "";
      this.saveGoalsToLocalStorage();
    },
    deleteTaskItem(goalIndex, itemIndex) {
      this.goals[goalIndex].task.splice(itemIndex, 1);
      this.saveGoalsToLocalStorage();
    },
    markGoalAsCompleted(index) {
      const goal = this.goals.splice(index, 1)[0];
      this.completedGoals.push({
        ...goal,
        timestamp: new Date().toLocaleString(),
        showTasks: false,
      });
      this.saveGoalsToLocalStorage();
      this.saveCompletedGoalsToLocalStorage();
    },
    toggleTaskDisplay(index) {
      this.completedGoals[index].showTasks = !this.completedGoals[index].showTasks;
    },
    deleteCompletedGoal(index) {
      this.completedGoals.splice(index, 1);
      this.saveCompletedGoalsToLocalStorage();
    },
    saveGoalsToLocalStorage() {
      localStorage.setItem("goals", JSON.stringify(this.goals));
    },
    loadGoalsFromLocalStorage() {
      const storedGoals = localStorage.getItem("goals");
      return storedGoals ? JSON.parse(storedGoals) : [];
    },
    saveCompletedGoalsToLocalStorage() {
      localStorage.setItem("completedGoals", JSON.stringify(this.completedGoals));
    },
    loadCompletedGoalsFromLocalStorage() {
      const storedCompletedGoals = localStorage.getItem("completedGoals");
      return storedCompletedGoals ? JSON.parse(storedCompletedGoals) : [];
    },
  },
};
</script>

<style scoped>
.my-checkbox{
  margin-right: 5px;
}

.goal-title{
  color: black;
  background-color: white;
}

.task-input{
  color: black;
  background-color: white;
}

.goal-separator{
  color: rgb(2, 142, 160);
}

.add-goal-container{
  color: black;
  border-radius: 10px;
}

.add-task-item{
  color:black;
  margin-left: 50px;
}

.task-list{
  margin-left: 50px;
}

h1 {
  /*This handles the "Goal Checklist" title.*/
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem !important
    /* Using !important ensures this occurs despite all other css that exists */
  ;
  Line-height: 1.5;
  color: rgb(179, 6, 179) !important;
  -webkit-text-stroke: .5px white;
}

.goals-application {
  display: flex;
  flex-direction: column;
  color: rgb(0, 0, 0);
  font-family: Arial, sans-serif;
  padding: 20px;
}
.columns {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.left-column,
.right-column {
  flex: 1;
  color: white;
  background: #6200ea;
  padding: 20px;
  border-radius: 10px;
  max-width: 45%;
}
.completed-goals .completed-goal {
  margin-bottom: 10px;
  background-size: auto;
  border: white;
}
.completed-tasks {
  border: white;
  background-size: auto;
  margin-left: 20px;
}

.goal-button{
  background-color: #8b5cf6;
  color: white;
  padding: 1px 15px;
  /* Smaller padding */
  font-size: 14px;
  /* Smaller text size */
  min-width: 80px;
  /* Set a smaller minimum width for buttons */
  max-width: 120px;
  /* Set a maximum width for buttons */
  border: none !important;
  border-radius: 8px;
  margin-left: 50px;
}

.delete-goal-button{
  background-color: #8b5cf6;
  color: white;
  padding: 1px 15px;
  /* Smaller padding */
  font-size: 14px;
  /* Smaller text size */
  min-width: 80px;
  /* Set a smaller minimum width for buttons */
  max-width: 120px;
  /* Set a maximum width for buttons */
  border: none !important;
  border-radius: 8px;
  margin-left: 220px;
}


.delete-goal-button:hover {
  background-color: #611efd !important;
  border: none !important;
}

.task-button{
  background-color: #8b5cf6;
  color: white;
  padding: 1px 15px;
  /* Smaller padding */
  font-size: 14px;
  /* Smaller text size */
  min-width: 50px;
  /* Set a smaller minimum width for buttons */
  max-width: 90px;
  /* Set a maximum width for buttons */
  border: none !important;
  border-radius: 8px;
  margin-left: 50px;
}

.delete-task-button{
  background-color: #8b5cf6;
  color: white;
  padding: 1px 15px;
  /* Smaller padding */
  font-size: 14px;
  /* Smaller text size */
  min-width: 80px;
  /* Set a smaller minimum width for buttons */
  max-width: 120px;
  /* Set a maximum width for buttons */
  border: none !important;
  border-radius: 8px;
  margin-left: 220px;
}


.delete-task-button:hover {
  background-color: #611efd !important;
  border: none !important;
}

.small-button {
  background-color: #8b5cf6;
  color: white;
  padding: 1px 15px;
  /* Smaller padding */
  font-size: 14px;
  /* Smaller text size */
  min-width: 80px;
  /* Set a smaller minimum width for buttons */
  max-width: 120px;
  /* Set a maximum width for buttons */
  border: none !important;
  border-radius: 8px;
  margin-left: 32px;
}

.small-button:hover {
  background-color: #611efd !important;
  border: none !important;
}

.smaller-button {
  background-color: #8b5cf6;
  color: white;
  padding: 1px 15px !important;
  /* Smaller padding */
  font-size: 14px;
  /* Smaller text size */
  min-width: 80px;
  /* Set a smaller minimum width for buttons */
  max-width: 120px;
  /* Set a maximum width for buttons */
  border: none !important;
  border-radius: 8px;
  margin-left: 32px;
}

.smaller-button:hover {
  background-color: #611efd !important;
  border: none !important;
}

.right-delete-button{
  background-color: #8b5cf6;
  color: white;
  padding: 1px 15px;
  /* Smaller padding */
  font-size: 14px;
  /* Smaller text size */
  min-width: 50px;
  /* Set a smaller minimum width for buttons */
  max-width: 90px;
  /* Set a maximum width for buttons */
  border: none !important;
  border-radius: 8px;
}

.right-delete-button:hover{
  background-color: #611efd !important;
  border: none !important;
}


/* Warning Message */
.warning-message {
  color: red;
  font-size: 14px;
  margin: 10px 0;
  font-weight: bold;
}

.action-gap1 {
  height: 10px;
}

.action-gap2 {
  height: 20px;
}

</style>
