import { useState, useEffect, useCallback } from 'react';
import { FileText, Trash2, Upload, Lightbulb, FileSearch, Search, Sparkles, Grid3X3, List } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { documentService } from '../services/documents';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700/50 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700" />
        <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-700" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-700" />
        <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-700" />
      </div>
      <div className="mt-3">
        <div className="h-5 w-16 rounded-full bg-gray-100 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    documentService
      .list()
      .then((docs) => {
        setDocuments(docs);
        setFiltered(docs);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(documents);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        documents.filter(
          (d) =>
            d.original_name.toLowerCase().includes(q) ||
            d.status.toLowerCase().includes(q)
        )
      );
    }
  }, [search, documents]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setUploading(true);
      try {
        for (const file of acceptedFiles) {
          await documentService.upload(file);
        }
        await load();
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024,
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await documentService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Documents
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload and manage your business PDFs
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`group cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          isDragActive
            ? 'border-arc-500 bg-gradient-to-br from-arc-50 to-purple-50 shadow-lg shadow-arc-500/10 dark:from-arc-950 dark:to-purple-950'
            : 'border-gray-300 hover:border-arc-400 hover:bg-gray-50/50 dark:border-gray-600 dark:hover:border-arc-500 dark:hover:bg-gray-800/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className={`transition-transform duration-300 ${isDragActive ? 'scale-110' : 'group-hover:scale-105'}`}>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-arc-50 to-purple-50 dark:from-arc-950 dark:to-purple-950">
            <Upload className={`h-6 w-6 transition-colors ${isDragActive ? 'text-arc-600' : 'text-gray-400'}`} />
          </div>
          <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {isDragActive
              ? 'Drop your PDFs here'
              : 'Drag & drop PDFs here, or click to browse'}
          </p>
          <p className="mt-1 text-xs text-gray-500">Max 20MB per file · PDF only</p>
        </div>
        {uploading && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-500">Uploading...</span>
          </div>
        )}
      </div>

      {documents.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents by name or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-arc-400 focus:outline-none focus:ring-2 focus:ring-arc-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-arc-50 to-purple-50 dark:from-arc-950 dark:to-purple-950">
              <FileText className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
              {search ? 'No matching documents' : 'No documents uploaded yet'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {search ? 'Try a different search term' : 'Upload a PDF to get started'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:border-arc-200 hover:shadow-lg hover:shadow-arc-500/5 dark:border-gray-700/50 dark:bg-gray-800 dark:hover:border-arc-700"
            >
              <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 transform">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-arc-500 to-purple-600 opacity-[0.03] blur-2xl" />
              </div>

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-arc-50 to-purple-50 p-3 dark:from-arc-950 dark:to-purple-950">
                    <FileText className="h-6 w-6 text-arc-600 dark:text-arc-400" />
                  </div>
                  <button
                    onClick={() => setDeleteTarget(doc)}
                    className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4">
                  <p
                    className="cursor-pointer text-sm font-medium text-gray-900 transition-colors hover:text-arc-600 dark:text-gray-100 dark:hover:text-arc-400"
                    onClick={() => setViewDoc(doc)}
                  >
                    {doc.original_name}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatSize(doc.file_size)}</span>
                    <span>·</span>
                    <span>{new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {doc.page_count && (
                      <>
                        <span>·</span>
                        <span>{doc.page_count} pages</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge variant={doc.status}>{doc.status}</Badge>
                  {doc.summary && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-arc-500">
                      <Sparkles className="h-3 w-3" />
                      AI Insights
                    </span>
                  )}
                </div>

                {doc.summary && (
                  <p
                    onClick={() => setViewDoc(doc)}
                    className="mt-2 line-clamp-2 cursor-pointer text-xs leading-relaxed text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {doc.summary}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Document"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
            <Trash2 className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {deleteTarget?.original_name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>

      <Modal
        open={!!viewDoc}
        onClose={() => setViewDoc(null)}
        title={viewDoc?.original_name || 'Document Details'}
        className="max-w-2xl"
      >
        {viewDoc && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 dark:from-gray-800/50 dark:to-gray-800/30">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Size</span>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatSize(viewDoc.file_size)}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Pages</span>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {viewDoc.page_count || 'Processing...'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                <div className="mt-0.5">
                  <Badge variant={viewDoc.status}>{viewDoc.status}</Badge>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Uploaded</span>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {new Date(viewDoc.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {viewDoc.summary ? (
              <div className="overflow-hidden rounded-xl border border-arc-200/50 bg-gradient-to-br from-arc-50 to-purple-50/50 p-4 dark:border-arc-800/30 dark:from-arc-950 dark:to-purple-950/30">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-arc-500 to-purple-600 p-1.5 shadow-sm">
                    <FileSearch className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-arc-700 dark:text-arc-300">
                    AI Summary
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {viewDoc.summary}
                </p>
              </div>
            ) : viewDoc.status === 'ready' ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-600">
                <Spinner size="sm" />
                <p className="mt-2 text-xs text-gray-400">Generating AI summary...</p>
              </div>
            ) : null}

            {viewDoc.key_insights && viewDoc.key_insights.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Key Insights
                  </h3>
                </div>
                <div className="space-y-2">
                  {viewDoc.key_insights.map((insight, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all hover:border-amber-200 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/50 dark:hover:border-amber-700"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[10px] font-bold text-white shadow-sm">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <details className="group rounded-xl border border-gray-100 dark:border-gray-700/50">
              <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <FileText className="h-4 w-4" />
                View extracted text
              </summary>
              {viewDoc.text_content && (
                <div className="max-h-48 overflow-y-auto border-t border-gray-100 bg-gray-50/50 p-4 text-xs text-gray-600 dark:border-gray-700/50 dark:bg-gray-900/50 dark:text-gray-400 scrollbar-thin">
                  {viewDoc.text_content.slice(0, 3000)}
                  {viewDoc.text_content.length > 3000 && (
                    <span className="text-gray-400">...</span>
                  )}
                </div>
              )}
            </details>
          </div>
        )}
      </Modal>
    </div>
  );
}
