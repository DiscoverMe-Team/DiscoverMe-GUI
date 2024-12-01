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
        <p v-if="showWarning" class="warning-message">
          You must enter a goal before adding anything to the list.
        </p>

        <!-- Display Goals -->
        <div v-if="goals.length > 0" class="goals">
          <div v-for="goal in goals" :key="goal.id" class="goal">
            <div class="goal-header">
              <input
                class="my-checkbox"
                type="checkbox"
                v-model="goal.completed"
                @change="updateGoal(goal.id, { completed: goal.completed })"
              />
              <input
                type="text"
                v-model="goal.title"
                class="goal-title"
                :disabled="!goal.editing"
              />
              <button class="small-button" @click="toggleGoalEdit(goal)">
                {{ goal.editing ? "Save" : "Edit" }}
              </button>
              <button class="delete-goal-button" @click="deleteGoal(goal.id)">
                Delete
              </button>
            </div>

            <!-- Task List -->
            <div class="task-list">
              <div v-for="task in goal.tasks" :key="task.id" class="task-item">
                <input
                  class="my-checkbox"
                  type="checkbox"
                  v-model="task.completed"
                  @change="updateTask(task.id, { completed: task.completed })"
                />
                <input
                  type="text"
                  v-model="task.text"
                  class="task-input"
                  :disabled="!task.editing"
                />
                <button class="smaller-button" @click="toggleTaskEdit(task)">
                  {{ task.editing ? "Save" : "Edit" }}
                </button>
                <button class="delete-task-button" @click="deleteTask(task.id)">
                  Delete
                </button>
              </div>
              <div class="add-task-item">
                <input
                  type="text"
                  v-model="goal.newTask"
                  placeholder="Add a task for this goal"
                />
                <button class="task-button" @click="addTask(goal.id, goal.newTask)">
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else>No goals to display yet!</p>
      </div>

      <!-- Right Column: Completed Goals -->
      <div class="right-column">
        <h1>Completed Goals</h1>
        <div v-if="completedGoals.length > 0" class="completed-goals">
          <div v-for="goal in completedGoals" :key="goal.id" class="completed-goal">
            <p>
              <strong>{{ goal.title }}</strong> - Completed on {{ goal.completed_at }}
            </p>
          </div>
        </div>
        <p v-else>No completed goals yet!</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "@/services/backend/GoalService";
import {
  getTasksByGoal,
  createTask,
  updateTask,
  deleteTask,
} from "@/services/backend/TaskService";

export default {
  data() {
    return {
      newGoal: "",
      goals: [],
      completedGoals: [],
      showWarning: false,
    };
  },
  methods: {
    async fetchGoals() {
      try {
        const goals = await getGoals();
        for (const goal of goals) {
          goal.tasks = await getTasksByGoal(goal.id);
          goal.newTask = "";
          goal.editing = false;
        }
        this.goals = goals.filter((goal) => !goal.completed);
        this.completedGoals = goals.filter((goal) => goal.completed);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    },
    async addGoal() {
      if (!this.newGoal.trim()) {
        this.showWarning = true;
        setTimeout(() => (this.showWarning = false), 3000);
        return;
      }
      try {
        alert(this.newGoal)
        const goal = await createGoal({ title: this.newGoal, description: "" });
        goal.tasks = [];
        goal.newTask = "";
        goal.editing = false;
        this.goals.push(goal);
        this.newGoal = "";
      } catch (error) {
        console.error("Error adding goal:", error);
      }
    },
    async updateGoal(id, data) {
      try {
        await updateGoal(id, data);
        await this.fetchGoals(); // Refresh the goals
      } catch (error) {
        console.error("Error updating goal:", error);
      }
    },
    async deleteGoal(id) {
      try {
        await deleteGoal(id);
        this.goals = this.goals.filter((goal) => goal.id !== id);
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    },
    async addTask(goalId, text) {
      if (!text.trim()) return;
      try {
        const task = await createTask({ goal: goalId, text });
        const goal = this.goals.find((goal) => goal.id === goalId);
        goal.tasks.push(task);
        goal.newTask = "";
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    async updateTask(id, data) {
      try {
        await updateTask(id, data);
        await this.fetchGoals(); // Refresh the goals
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    async deleteTask(id) {
      try {
        await deleteTask(id);
        await this.fetchGoals(); // Refresh the goals
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    toggleGoalEdit(goal) {
      if (goal.editing) {
        this.updateGoal(goal.id, { title: goal.title });
      }
      goal.editing = !goal.editing;
    },
    toggleTaskEdit(task) {
      if (task.editing) {
        this.updateTask(task.id, { text: task.text });
      }
      task.editing = !task.editing;
    },
  },
  async mounted() {
    await this.fetchGoals();
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
