import api from './api';
import { JournalEntry } from '@/models/JournalEntry';

const mapToJournalEntry = (data) => new JournalEntry(data.id, data.user, data.title, data.content, data.created_at);

export const getJournalEntries = async () => {
    const response = await api.get('/journalentries/');
    return response.data.map(mapToJournalEntry);
};

export const getJournalEntryById = async (id) => {
    const response = await api.get(`/journalentries/${id}/`);
    return mapToJournalEntry(response.data);
};

export const createJournalEntry = async (data) => {
    const response = await api.post('/journalentries/', data);
    return mapToJournalEntry(response.data);
};

export const updateJournalEntry = async (id, data) => {
    const response = await api.put(`/journalentries/${id}/`, data);
    return mapToJournalEntry(response.data);
};

export const deleteJournalEntry = async (id) => {
    await api.delete(`/journalentries/${id}/`);
};
