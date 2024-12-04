<script>
import { createJournalEntry, deleteJournalEntry, getJournalEntries } from '@/services/backend/JournalEntryService';
import { onMounted, ref } from 'vue';
export default {
    setup() {
        const title = ref(''); // Bound to title input
        const entry = ref(''); // Bound to entry textarea
        const savedEntries = ref([]);
        const isFormVisible = ref(false); // Controls the visibility of the journal entry form
        const isSaved = ref(false); // Flag to show confirmation message after saving
        const editingEntry = ref(null); // The entry that is being edited
        const deleteSuccessMessage = ref(''); //Store deletion success message

        const fetchEntries = async () => {
            try {
                const journalEntriesResponse = await getJournalEntries();
                // Format the dates to display locally with only hour, minutes, and date
                savedEntries.value =
                    journalEntriesResponse.map((entry) => {
                        const entryDate = new Date(entry.created_at); // Convert to Date object
                        const formattedTime = entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const formattedDate = entryDate.toLocaleDateString();
                        return {
                            ...entry,
                            created_at: `${formattedDate} ${formattedTime}` // Reformat the created_at field
                        };
                    }) || [];
            } catch (error) {
                errorMessage.value = 'Error fetching data. Please try again later.';
                console.error('Data Fetch Error:', error);
            }
        };

        // Method to save the journal entry
        const saveEntry = async () => {
            if (title.value && entry.value) {
                try {
                    const currentTime = new Date();
                    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const formattedDate = currentTime.toLocaleDateString();
                    const newEntry = {
                        title: title.value,
                        content: entry.value,
                        created_at: `${formattedDate} ${formattedTime}`
                    };

                    if (editingEntry.value !== null) {
                        // Update an existing entry
                        await createJournalEntry({ ...editingEntry.value, ...newEntry });
                    } else {
                        // Create a new entry
                        await createJournalEntry(newEntry);
                    }

                    // Refresh the entries list
                    await fetchEntries();

                    // Clear the form and reset the state
                    clearFields();
                    isFormVisible.value = false;
                    editingEntry.value = null;

                    // Show success message
                    isSaved.value = true;

                    // Hide the success message after 3 seconds
                    setTimeout(() => {
                        isSaved.value = false;
                    }, 3000);
                } catch (error) {
                    console.error('Error saving entry:', error);
                    alert('Failed to save the entry. Please try again.');
                }
            } else {
                alert('Please provide both a title and an entry!');
            }
        };

        // Method to delete the current journal entry (reset fields)
        const deleteEntry = async () => {
            if (editingEntry.value !== null) {
                try {

                    // Remove the entry from the backend
                    await deleteJournalEntry(editingEntry.value.id);

                    // Refresh the entries list
                    await fetchEntries();

                    // Clear the form and reset the state
                    clearFields();
                    isFormVisible.value = false;
                    editingEntry.value = null;

                    // Set success message
                    deleteSuccessMessage.value = 'Entry deleted successfully!';

                    // Hide the success message after 3 seconds
                    setTimeout(() => {
                        deleteSuccessMessage.value = '';
                    }, 3000);
                } catch (error) {
                    console.error('Error deleting entry:', error);
                    alert('Failed to delete the entry. Please try again.');
                }
            }
        };

        // Method to cancel (reset fields)
        const cancelEntry = () => {
            clearFields();
            isFormVisible.value = false; // Hide the form when cancel is clicked
            editingEntry.value = null; // Reset editing entry
        };

        // Helper method to clear the input fields
        const clearFields = () => {
            title.value = '';
            entry.value = '';
        };

        const showForm = () => {
            clearFields(); // Clear any existing data in the form
            isFormVisible.value = true;
            isSaved.value = false; // Reset saved message when showing form
            editingEntry.value = null; // Ensure we're not editing an existing entry
        };

        const goBack = () => {
            isFormVisible.value = false; // Hide form and show list of entries
            editingEntry.value = null; // Reset editing entry when going back
        };

        // Method to start editing an entry
        const editEntry = (index) => {
            const entryToEdit = savedEntries.value[index];
            title.value = entryToEdit.title;
            entry.value = entryToEdit.content;
            isFormVisible.value = true; // Show the form for editing
            editingEntry.value = entryToEdit; // Set the entry being edited
        };

        onMounted(() => {
            fetchEntries();
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
            savedEntries,
            deleteSuccessMessage
        };
    }
};
</script>

<template>
    <div class="app">
        <Fluid>
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full flex-grow">
                    <div class="flex justify-between items-center">
                        <h1 class="text-4xl font-bold">Journal Entries</h1>
                        <div class="flex gap-4">
                            <Button v-if="!isFormVisible" label="Create Entry" icon="pi pi-plus" class="large-button"
                                @click="showForm" />
                            <Button v-if="isFormVisible" label="Back to Entries" icon="pi pi-arrow-left"
                                class="large-button" @click="goBack" />
                        </div>
                    </div>

                    <!-- Conditionally Render the Form or the Saved Entries List -->
                    <div v-if="isFormVisible" class="">
                        <!-- Journal Entry Form -->
                        <h2 v-if="!editingEntry" text-2xl mb-4 style="font-size: large;">Create New Entry</h2>
                        <h2 v-if="editingEntry" text-2xl mb-4 style="font-size: large;">Edit Entry</h2>

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
                            <Button v-if="editingEntry" label="Delete" icon="pi pi-trash" class="small-button"
                                @click="deleteEntry" />
                            <Button label="Cancel" icon="pi pi-times" class="small-button" @click="cancelEntry" />
                        </div>
                    </div>

                    <!-- Entry saved confirmation -->
                    <div v-if="isSaved && !isFormVisible" class="mt-4">
                        <p class="text-green-500">Entry saved successfully!</p>
                    </div>

                    <div v-if="deleteSuccessMessage && !isFormVisible" class="mt-4">
                        <p class="text-green-500">{{ deleteSuccessMessage }}</p>
                    </div>

                    <!-- Display saved journal entries by default -->
                    <div v-if="!isFormVisible && savedEntries.length" class="mt-6">
                        <h2 class="text-2xl">Current Entries:</h2>
                        <ul>
                            <li v-for="(entry, index) in savedEntries" :key="index">
                                <a href="#" @click.prevent="editEntry(index)" class="entry-link">
                                    <strong>{{ entry.title }}</strong> - {{ entry.created_at }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Fluid>
    </div>
</template>

<style scoped>
.app {
    background-image: url('/src/assets/JournalEntry.jpg');
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    min-height: 85.5vh;
    padding: 20px;
}

.card {
    color: black;
    margin-right: 40px;
    margin-left: 40px;
    position: relative;
    bottom: 35px;
}

.title-input {
    width: auto;
    max-width: 400px;
    min-width: 150px;
    padding: 8px;
    box-sizing: border-box;
    margin-bottom: 16px;
}

.small-button {
    padding: 6px 12px;
    font-size: 14px;
    min-width: 80px;
    max-width: 120px;
}

.large-button {
    padding: 8px 12px;
    font-size: 14px;
    min-width: 150px;
    max-width: 180px;
}

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
    border: none;
    border-radius: 8px;
    background: linear-gradient(0deg, rgba(148, 0, 211, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(135, 206, 250) 0%, rgb(148, 0, 211) 100%);
    color: white;
    text-decoration: none;
    font-weight: bold;
    transition:
        background-color 0.3s ease,
        transform 0.2s ease,
        box-shadow 0.3s ease;
}

.entry-link:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    background: linear-gradient(0deg, rgba(148, 0, 211, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(148, 0, 211) 0%, rgb(135, 206, 250) 100%);
}

.entry-link:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}
</style>
