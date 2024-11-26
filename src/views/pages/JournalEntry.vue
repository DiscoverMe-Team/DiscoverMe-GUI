<script>
import { JournalEntry } from '@/models/JournalEntry';
import { createJournalEntry, deleteJournalEntry, getJournalEntries } from '@/services/backend/JournalEntryService';
import { onMounted, ref } from 'vue';
export default {
    setup() {
        const title = ref('');
        const entry = ref('');
        const savedEntries = ref([]);
        const isFormVisible = ref(false);
        const isSaved = ref(false);
        const editingEntry = ref(null);
        const isDeleteConfirmationVisible = ref(false);

        const fetchEntries = async () => {
            try {
                const journalEntriesResponse = await getJournalEntries();
                savedEntries.value = journalEntriesResponse || [];
            } catch (error) {
                errorMessage.value = 'Error fetching data. Please try again later.';
                console.error('Data Fetch Error:', error);
            }
        };

        // Method to save the journal entry
        const saveEntry = () => {
            if (title.value && entry.value) {
                const currentTime = new Date();
                const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time to exclude seconds
                const formattedDate = currentTime.toLocaleDateString();
                new JournalEntry();
                const newEntry = {
                    title: title.value,
                    content: entry.value,
                    created_at: `${formattedDate} ${formattedTime}`
                };

                if (editingEntry.value !== null) {
                    savedEntries[editingEntry] = newEntry;
                } else {
                    createJournalEntry(newEntry);
                }

               
                localStorage.setItem('savedEntries', JSON.stringify(savedEntries));

                clearFields();
                isSaved = true;
                setTimeout(() => {
                    isSaved = false;
                }, 3000);
                isFormVisible.value = false;
                editingEntry.value = null;
            } else {
                alert('Please provide both a title and an entry!');
            }
        };

        const deleteEntry = () => {
            if (editingEntry.value !== null) {

                deleteJournalEntry(editingEntry.value.id);
                clearFields();
                isFormVisible.value = false;
                editingEntry.value = null;
                isDeleteConfirmationVisible.value = false;
                $nextTick(() => {
                    alert('Entry deleted successfully!');
                });
            }
        };

        const cancelEntry = () => {
            clearFields();
            isFormVisible.value = false;
            editingEntry.value = null;
        };

        const clearFields = () => {
            title.value = '';
            entry.value = '';
        };

        const showForm = () => {
            clearFields();
            isFormVisible.value = true;
            isSaved.value = false;
            editingEntry.value = null;
        };

        const goBack = () => {
            isFormVisible.value = false;
            editingEntry.value = null;
        };

        const editEntry = (index) => {
            const entryToEdit = savedEntries.value[index];
            title.value = entryToEdit.title;
            entry.value = entryToEdit.content;
            isFormVisible.value = true;
            editingEntry.value = entryToEdit;
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
                                <strong>{{ entry.title }}</strong> - {{ entry.created_at }}
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
    width: auto;
    max-width: 400px;
    min-width: 150px;
    padding: 8px;
    box-sizing: border-box;
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
