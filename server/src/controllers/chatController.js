import { Chat } from '../models/chat.js';
import { Message } from '../models/message.js';
import { Document } from '../models/document.js';
import { askGemini } from '../services/geminiService.js';

export async function list(req, res, next) {
  try {
    const chats = await Chat.findByUser(req.userId);
    res.json({ chats });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const chat = await Chat.create({
      userId: req.userId,
      title: req.body.title,
    });
    res.status(201).json({ chat });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    const messages = await Message.findByChat(req.params.id);
    const documents = await Document.findByUser(req.userId);
    res.json({ chat, messages, documents });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    await Chat.remove(req.params.id);
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const { content, documentIds } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const userMessage = await Message.create({
      chatId: req.params.id,
      role: 'user',
      content,
    });

    let context = '';
    if (documentIds && documentIds.length > 0) {
      for (const docId of documentIds) {
        const doc = await Document.findById(docId);
        if (doc && doc.user_id === req.userId && doc.text_content) {
          context += `\n--- Document: ${doc.original_name} ---\n${doc.text_content.slice(0, 5000)}\n`;
        }
      }
    } else {
      const docs = await Document.findByUser(req.userId);
      for (const doc of docs) {
        if (doc.text_content) {
          context += `\n--- Document: ${doc.original_name} ---\n${doc.text_content.slice(0, 3000)}\n`;
        }
      }
    }

    if (!context) {
      context = 'No documents available. Answer generally as a helpful business assistant.';
    }

    const aiResponse = await askGemini(content, context);

    const assistantMessage = await Message.create({
      chatId: req.params.id,
      role: 'assistant',
      content: aiResponse,
    });

    if (chat.title === 'New Chat') {
      const title = content.slice(0, 60) + (content.length > 60 ? '...' : '');
      await Chat.updateTitle(req.params.id, title);
    }

    res.json({
      userMessage,
      assistantMessage,
    });
  } catch (err) {
    next(err);
  }
}
