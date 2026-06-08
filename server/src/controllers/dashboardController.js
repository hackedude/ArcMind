import { Document } from '../models/document.js';
import { Chat } from '../models/chat.js';

export async function stats(req, res, next) {
  try {
    const documentCount = await Document.countByUser(req.userId);
    const chatCount = await Chat.countByUser(req.userId);
    const recentDocuments = await Document.recentByUser(req.userId, 5);
    const chats = await Chat.findByUser(req.userId);

    const processedDocs = recentDocuments.filter(
      (d) => d.status === 'ready'
    ).length;

    res.json({
      stats: {
        totalDocuments: documentCount,
        totalChats: chatCount,
        processedDocuments: processedDocs,
      },
      recentDocuments,
      recentChats: chats.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
}
