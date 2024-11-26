<template>
  <div class="layout-sidebar bg-surface-2">
        <app-menu></app-menu>
    </div>

  <div class="app">
    <div class="content">
       <!-- Back Button Code -->
      <button class="back-button" @click="navigateToDashboard">Back to Dashboard</button>

      <h1>Goal Checklist</h1>

      <!-- Goal Checklist Box -->
      <div class="add-goal-container">
        <input 
          type="text" 
          v-model="newGoal" 
          placeholder="Enter a new goal you want to achieve." 
        />
        <button @click="addGoal">Add Goal</button>
      </div>
  
      <!-- Warning Message - displayed when user tries to submit a goal with no text in the box -->
      <p v-if="showWarning" class="warning-message">
          You must enter a goal before you can add.
      </p>

      <!-- Message if No Goals Exist - this only displays while the goal list is empty -->
      <div v-if="goals.length === 0">
        <p>No goals to display yet!</p>
      </div>

      <!-- Goals Checklist Code - applies to each checklist item -->
      <div v-for="(goal, goalIndex) in goals" :key="goalIndex" class="goal">
        <div class="goal-header">
          <input
            type="text"
            v-model="goal.text"
            class="goal-title"
            :disabled="!goal.editing"
          />
          <div class="checklist-actions">
          <button @click="goal.editing = !goal.editing">
            {{ goal.editing ? "Save" : "Edit" }} <!-- This prevents the need for two separate buttons. -->
          </button>
          <div class="action-gap1"></div>
          <button @click="deleteGoal(goalIndex)">
              Delete
          </button>
        </div>
      </div>

        <!-- Checklist Items -->
        <div v-if="goal.checklist.length > 0" class="checklist">
          <div
            v-for="(item, itemIndex) in goal.checklist"
            :key="itemIndex"
            class="checklist-item"
          >
            <input 
              type="checkbox" 
              v-model="item.completed" 
            />
            <input
              type="text"
              v-model="item.text"
              :disabled="!item.editing"
              class="checklist-input"
            />
            <div class="checklist-actions">
              <button @click="item.editing = !item.editing">
                {{ item.editing ? "Save" : "Edit" }}
              </button>
              <div class="action-gap2"></div>
              <button @click="deleteChecklistItem(goalIndex, itemIndex)">
                  Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Add Checklist Item -->
        <div class="add-checklist-item">
          <input 
            type="text" 
            v-model="goal.newChecklistItem" 
            placeholder="Create a task to achieve this goal."
          />
          <button @click="addChecklistItem(goalIndex)">Add</button>
        </div>
      </div>
    </div>
  </div>

<!--Ensures the sidebar menu looks nice-->
<ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>



</template>

<script setup>
// Imports for Sidebar Menu
import { ref } from 'vue';
import AppMenu from '../layout/AppMenu.vue';

// Menu Display Items
const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Journal Entries', icon: 'pi pi-pencil', to: '/journal' },
            {label: 'Goal Setting', icon: 'pi pi-fw pi-check-square', to: '/goals'}
        ]
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Landing',
                icon: 'pi pi-fw pi-globe',
                to: '/home'
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access'
                    }
                ]
            },
        ]
    },
]);

</script>

<script>
// Imports for background coloring
// Imports for background color
import { createApp } from 'vue';
import App from '../App.vue';
import router from '../router';
import { definePreset } from '@primevue/themes';
import Lara from '@primevue/themes/lara';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

export default {
  data() {
    return {
      newGoal: "",
      goals: this.loadGoalsFromLocalStorage(),
      showWarning: false, // Tracks whether to show the warning
    };

  },
  methods: {
  // Navigate to Dashboard
  navigateToDashboard() {
      this.$router.push("/");
      },
  
  // Add a new goal
  addGoal() {
    if (this.newGoal.trim() === "") {
      this.showWarning = true; // Show warning if input is empty
      setTimeout(() => {
        this.showWarning = false; // Hide warning after 3 seconds
      }, 3000);
      return;
    }
    this.goals.push({
      text: this.newGoal,
      editing: false,
      checklist: [],
      newChecklistItem: "",
    });
    this.newGoal = "";
    this.saveGoalsToLocalStorage();
  },

    // Delete a goal
    deleteGoal(index) {
      this.goals.splice(index, 1);
      this.saveGoalsToLocalStorage();
    },

    // Add a new checklist item to a goal
    addChecklistItem(goalIndex) {
      const goal = this.goals[goalIndex];
      if (goal.newChecklistItem.trim() === "") return;
      goal.checklist.push({ text: goal.newChecklistItem, completed: false, editing: false });
      goal.newChecklistItem = "";
      this.saveGoalsToLocalStorage();
    },

    // Delete a checklist item
    deleteChecklistItem(goalIndex, itemIndex) {
      this.goals[goalIndex].checklist.splice(itemIndex, 1);
      this.saveGoalsToLocalStorage();
    },

    // Toggle goal editing
    toggleGoalEditing(goal) {
      goal.editing = !goal.editing;
      this.saveGoalsToLocalStorage();
    },

    // Toggle checklist item editing
    toggleChecklistItemEditing(goalIndex, itemIndex) {
      const item = this.goals[goalIndex].checklist[itemIndex];
      item.editing = !item.editing;
      this.saveGoalsToLocalStorage();
    },

    // Save goals to localStorage
    saveGoalsToLocalStorage() {
      localStorage.setItem("goals", JSON.stringify(this.goals));
    },

    // Load goals from localStorage
    loadGoalsFromLocalStorage() {
      const storedGoals = localStorage.getItem("goals");
      return storedGoals ? JSON.parse(storedGoals) : [];
    },
  },
};

const app = createApp(App);

app.use(router);
const MyPreset = definePreset(Lara, {
    semantic: {
        primary: {
            50: '{violet.50}',
            100: '{violet.100}',
            200: '{violet.200}',
            300: '{violet.300}',
            400: '{violet.400}',
            500: '{violet.500}',
            600: '{violet.600}',
            700: '{violet.700}',
            800: '{violet.800}',
            900: '{violet.900}',
            950: '{violet.950}'
        }
    }
});
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.app-dark',
            primaryColor: '#8b5cf6'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
</script>


<style>
/* Background */
.app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
}
/* Back Button */
  .back-button {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 5px 10px;
      background-color: #6200ea;
      border: none;
      color: white;
      border-radius: 5px;
      cursor: pointer;
  }
  .back-button:hover {
      background-color: #3700b3;
  }


/* Content Container */
h1{
  /*This handles the "Goal Checklist" title.*/
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem !important /* Using !important ensures this occurs despite all other css that exists */;
  Line-height: 1.5;
  color:violet !important
}
.content {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
}

/* Input and Buttons */
.add-goal-container, .add-checklist-item {
  margin-bottom: 20px;
}

input[type="text"] {
  padding: 5px;
  margin-right: 10px;
  width: 70%;
  color: #333; /* Input box font color - this ensures the data entered is not white text*/
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
  border: 2px solid blueviolet;
  color: white; /* Button font color - this needs to be separate from the input box*/
  border-radius: 5px;
}

button:hover {
  background-color: #3700b3;
}

/* Warning Message */
  .warning-message {
      color: red;
      font-size: 14px;
      margin: 10px 0;
      font-weight: bold;
}

/* Goals */
  .goal {
      background-color: rgba(204, 0, 0, 0.1);
      margin-bottom: 20px;
      padding: 10px;
      border-radius: 5px;
      text-align: left;
}
  .goal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
}
  .goal-title {
      flex-grow: 1;
      margin-right: 10px;
      padding: 5px;
      color: #03aac7 !important; /* Input box font color - this is for the textbox with the overall goal*/
      background: #222 !important; 
}

/* Checklist */
  .checklist-item {
      display: flex;
      align-items: center;
      margin-top: 10px;
}
  .checklist-input {
      flex-grow: 1;
      margin-left: 10px;
      padding: 5px;
      color: #03aac7 !important; /* Input box font color - this is for the individual task in the checklist*/
      background: #222 !important; 
}

  .checklist-input.completed {
      text-decoration: line-through;
      color: #aaa;
  }

  /* Checklist Actions */
  .checklist-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 15px;
  }
  .action-gap1 {
      height: 10px;
  }

  .action-gap2 {
      height: 10px;
  }
</style>