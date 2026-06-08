import api from './api';

export const documentService = {
  async list() {
    const { data } = await api.get('/documents');
    return data.documents;
  },

  async upload(file) {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post('/documents/upload', form);
    return data.document;
  },

  async get(id) {
    const { data } = await api.get(`/documents/${id}`);
    return data.document;
  },

  async remove(id) {
    await api.delete(`/documents/${id}`);
  },

  async stats() {
    const { data } = await api.get('/dashboard/stats');
    return data;
  },
};
