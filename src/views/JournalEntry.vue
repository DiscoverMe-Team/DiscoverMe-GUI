<script>
import { getJournalEntries } from '@/services/backend/JournalEntryService';
import { onMounted, ref } from 'vue';
export default {
    setup() {
        const title = ref(''); // Bound to title input
        const entry = ref(''); // Bound to entry textarea
        const savedEntries = ref([]);
        const isFormVisible = ref(false); // Controls the visibility of the journal entry form
        const isSaved = ref(false); // Flag to show confirmation message after saving
        const editingEntry = ref(null); // The entry that is being edited
        const isDeleteConfirmationVisible = ref(false); // Flag for showing delete confirmation

        const fetchEntries = async () => {
            try {
                const journalEntriesResponse = await Promise.all([getJournalEntries()]);
                savedEntries.value = journalEntriesResponse || [];
            } catch (error) {
                errorMessage.value = 'Error fetching data. Please try again later.';
                console.error('Data Fetch Error:', error);
            }
        };

        // Method to save the journal entry
        const saveEntry = () => {
            if (title && entry) {
                const currentTime = new Date();
                const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time to exclude seconds
                const formattedDate = currentTime.toLocaleDateString(); // Get the date separately
                const newEntry = {
                    title: title,
                    content: entry,
                    timestamp: `${formattedDate} ${formattedTime}` // Combine date and formatted time
                };

                // If we're editing an existing entry, replace it
                if (editingEntry !== null) {
                    savedEntries[editingEntry] = newEntry;
                } else {
                    // Otherwise, add it as a new entry
                    savedEntries.push(newEntry);
                }

                // Save entries to localStorage to persist across page reloads
                localStorage.setItem('savedEntries', JSON.stringify(savedEntries));

                clearFields(); // Optionally clear the fields after saving
                isSaved = true; // Show the confirmation message
                setTimeout(() => {
                    isSaved = false; // Hide the confirmation after 3 seconds
                }, 3000);
                isFormVisible = false; // Hide the form after saving
                editingEntry = null; // Reset editing entry
            } else {
                alert('Please provide both a title and an entry!');
            }
        };

        // Method to delete the current journal entry (reset fields)
        const deleteEntry = () => {
            if (editingEntry !== null) {
                // Remove the entry from the array
                savedEntries.splice(editingEntry, 1);
                localStorage.setItem('savedEntries', JSON.stringify(savedEntries)); // Update localStorage

                // Clear the form, reset state, and navigate back
                clearFields();
                isFormVisible = false;
                editingEntry = null;

                // Hide confirmation
                isDeleteConfirmationVisible = false;

                // Provide user feedback
                $nextTick(() => {
                    alert('Entry deleted successfully!');
                });
            }
        };

        // Method to cancel (reset fields)
        const cancelEntry = () => {
            clearFields();
            isFormVisible = false; // Hide the form when cancel is clicked
            editingEntry = null; // Reset editing entry
        };

        // Helper method to clear the input fields
        const clearFields = () => {
            title = '';
            entry = '';
        };

        const showForm = () => {
            clearFields(); // Clear any existing data in the form
            isFormVisible = true;
            isSaved = false; // Reset saved message when showing form
            editingEntry = null; // Ensure we're not editing an existing entry
        };

        const goBack = () => {
            isFormVisible = false; // Hide form and show list of entries
            editingEntry = null; // Reset editing entry when going back
        };

        // Method to start editing an entry
        const editEntry = (index) => {
            const entryToEdit = savedEntries[index];
            title = entryToEdit.title;
            entry = entryToEdit.content;
            isFormVisible = true; // Show the form for editing
            editingEntry = index; // Set the entry being edited
        };

        onMounted(() => {
            fetchEntries();
            alert(savedEntries.value);
        });

        return {
            title,
            entry,
            isFormVisible,
            isSaved,
            editingEntry,
            saveEntry,
            deleteEntry,
            editEntry,
            clearFields,
            showForm,
            goBack,
            cancelEntry,
            savedEntries
        };
    }
};
</script>

<template>
    <Fluid>
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full flex-grow">
                <div class="flex justify-between items-center">
                    <h1 class="text-4xl font-bold">Journal Entries</h1>
                    <div class="flex gap-4">
                        <Button v-if="!isFormVisible" label="Create Entry" icon="pi pi-plus" class="large-button" @click="showForm" />
                        <Button v-if="isFormVisible" label="Back to Entries" icon="pi pi-arrow-left" class="large-button" @click="goBack" />
                    </div>
                </div>

                <!-- Conditionally Render the Form or the Saved Entries List -->
                <div v-if="isFormVisible" class="mt-6">
                    <!-- Journal Entry Form -->
                    <h2 class="text-2xl mb-4">Create New Entry</h2>

                    <div class="flex flex-col gap-2">
                        <label for="title">Title</label>
                        <InputText id="title" type="text" class="title-input" v-model="title" />
                    </div>

                    <div class="flex flex-wrap">
                        <label for="entry">Entry</label>
                        <Textarea id="entry" rows="5" v-model="entry" />
                    </div>

                    <div class="flex gap-4 mt-4">
                        <Button label="Save" icon="pi pi-check" class="small-button" @click="saveEntry" />
                        <Button label="Delete" icon="pi pi-trash" class="small-button" @click="deleteEntry" />
                        <Button label="Cancel" icon="pi pi-times" class="small-button" @click="cancelEntry" />
                    </div>
                </div>

                <!-- Entry saved confirmation -->
                <div v-if="isSaved && !isFormVisible" class="mt-4">
                    <p class="text-green-500">Entry saved successfully!</p>
                </div>

                <!-- Display saved journal entries by default -->
                <div v-if="!isFormVisible && savedEntries.length" class="mt-6">
                    <h2 class="text-2xl">History:</h2>
                    <ul>
                        <li v-for="(entry, index) in savedEntries" :key="index">
                            <a href="#" @click.prevent="editEntry(index)" class="entry-link">
                                <strong>{{ entry.title }}</strong> - {{ entry.timestamp }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<style scoped>
.title-input {
    width: auto; /* Allow the input box to shrink or expand */
    max-width: 400px; /* Max width of the title box */
    min-width: 150px; /* Minimum width of the title box */
    padding: 8px; /* Optional: Adjust padding as needed */
    box-sizing: border-box; /* Ensures padding doesn't affect the total width */
}

.small-button {
    padding: 6px 12px; /* Smaller padding */
    font-size: 14px; /* Smaller text size */
    min-width: 80px; /* Set a smaller minimum width for buttons */
    max-width: 120px; /* Set a maximum width for buttons */
}

.large-button {
    padding: 8px 12px; /* Smaller padding */
    font-size: 14px; /* Smaller text size */
    min-width: 150px; /* Set a smaller minimum width for buttons */
    max-width: 180px; /* Set a maximum width for buttons */
}

/* Styling for the clickable entries */
ul {
    list-style-type: none;
    padding-left: 0;
}

li {
    margin-bottom: 12px;
}

.entry-link {
    display: block;
    padding: 10px;
    border: 1px solid #007bff;
    border-radius: 8px;
    background-color: #f9f9f9;
    color: #007bff;
    text-decoration: none;
    transition:
        background-color 0.3s ease,
        transform 0.2s ease;
}

.entry-link:hover {
    background-color: #e0f7fa;
    transform: translateY(-2px);
}

.entry-link:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}
</style>
