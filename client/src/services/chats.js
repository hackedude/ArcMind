import api from './api';

export const chatService = {
  async list() {
    const { data } = await api.get('/chats');
    return data.chats;
  },

  async create(title) {
    const { data } = await api.post('/chats', { title });
    return data.chat;
  },

  async get(id) {
    const { data } = await api.get(`/chats/${id}`);
    return data;
  },

  async remove(id) {
    await api.delete(`/chats/${id}`);
  },

  async sendMessage(chatId, content, documentIds) {
    const { data } = await api.post(`/chats/${chatId}/messages`, {
      content,
      documentIds,
    });
    return data;
  },
};
