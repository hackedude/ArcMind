import { Document } from '../models/document.js';
import { extractTextFromPdf } from '../services/pdfService.js';
import { generateSummary } from '../services/geminiService.js';
import fs from 'fs';

export async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const doc = await Document.create({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    try {
      const { text, pageCount } = await extractTextFromPdf(req.file.path);
      await Document.updateText(doc.id, text, pageCount);

      try {
        const { summary, keyInsights } = await generateSummary(text, req.file.originalname);
        await Document.updateSummary(doc.id, summary, keyInsights);
      } catch (summaryErr) {
        console.error('Summary generation error:', summaryErr);
      }
    } catch (parseErr) {
      await Document.updateStatus(doc.id, 'error');
      console.error('PDF parse error:', parseErr);
    }

    const updated = await Document.findById(doc.id);
    res.status(201).json({ document: updated });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const documents = await Document.findByUser(req.userId);
    res.json({ documents });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || doc.user_id !== req.userId) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ document: doc });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || doc.user_id !== req.userId) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = `uploads/${doc.filename}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Document.remove(req.params.id);
    res.json({ message: 'Document deleted' });
  } catch (err) {
    next(err);
  }
}
