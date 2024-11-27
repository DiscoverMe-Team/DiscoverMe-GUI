<template>
    <div class="set-mood-modal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <header class="modal-header">
          <h3>Set a Mood</h3>
          <button class="close-button" @click="closeModal">✖</button>
        </header>
        <main class="modal-body">
          <!-- Mood Dropdown -->
          <div class="form-group">
            <label for="mood-select">Select Mood:</label>
            <select id="mood-select" v-model="selectedMoodId" class="form-control">
              <option disabled value="">-- Choose a Mood --</option>
              <option v-for="mood in moods" :key="mood.id" :value="mood.id">
                {{ mood.mood_type }} {{ mood.emoji }}
              </option>
            </select>
          </div>
  
          <!-- Notes -->
          <div class="form-group">
            <label for="mood-notes">Notes (Optional):</label>
            <textarea
              id="mood-notes"
              v-model="notes"
              class="form-control"
              placeholder="Add any additional notes about your mood..."
            ></textarea>
          </div>
        </main>
        <footer class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn btn-primary" @click="saveMood">Save</button>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getMoods } from '@/services/backend/MoodService';
  import { createMoodLog } from '@/services/backend/MoodLogService';
  
  const emit = defineEmits(['close', 'save']);
  const selectedMoodId = ref('');
  const notes = ref('');
  const moods = ref([]);
  
  onMounted(async () => {
    try {
      moods.value = await getMoods(); // Fetch moods
    } catch (error) {
      console.error('Failed to load moods:', error);
    }
  });
  
  async function saveMood() {
    if (!selectedMoodId.value) {
      alert('Please select a mood.');
      return;
    }
  
    const moodLogData = {
      mood: selectedMoodId.value, // Send the selected mood ID
      date_logged: new Date().toISOString(), // Current date and time
      notes: notes.value || '', // Optional notes
    };
  
    try {
      const newMoodLog = await createMoodLog(moodLogData);
      console.log('Mood log created:', newMoodLog);
      emit('save', newMoodLog); // Emit the saved mood log
      closeModal();
    } catch (error) {
      console.error('Failed to save mood log:', error);
      alert('Error saving mood. Please try again.');
    }
  }
  
  function closeModal() {
    emit('close'); // Emit a close event
  }
  </script>
  
<style scoped>
/* Modal Styles */
.set-mood-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body .form-group {
  margin-bottom: 1rem;
}

.modal-body label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.modal-body .form-control {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-footer .btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.modal-footer .btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
}

.modal-footer .btn-secondary {
  background-color: #6c757d;
  color: #fff;
  border: none;
}
</style>
