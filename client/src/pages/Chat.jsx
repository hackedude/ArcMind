import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatService } from '../services/chats';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import ChatSidebar from '../components/chat/ChatSidebar';
import Spinner from '../components/ui/Spinner';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  useEffect(() => {
    chatService
      .list()
      .then(setChats)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (chatId) {
      chatService.get(chatId).then((data) => {
        setMessages(data.messages || []);
      });
    } else {
      setMessages([]);
    }
  }, [chatId]);

  const handleNewChat = async () => {
    const chat = await chatService.create('New Chat');
    setChats((prev) => [chat, ...prev]);
    navigate(`/chat/${chat.id}`);
  };

  const handleDeleteChat = async (id) => {
    await chatService.remove(id);
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (chatId === id) {
      navigate('/chat');
    }
  };

  const handleSend = async (content) => {
    let currentChatId = chatId;

    if (!currentChatId) {
      const chat = await chatService.create('New Chat');
      setChats((prev) => [chat, ...prev]);
      currentChatId = chat.id;
      navigate(`/chat/${chat.id}`, { replace: true });
    }

    const userMsg = { role: 'user', content, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const result = await chatService.sendMessage(currentChatId, content, []);
      setMessages((prev) => [...prev, result.assistantMessage]);
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? { ...c, title: result.assistantMessage.content ? c.title : c.title }
            : c
        )
      );
    } catch (err) {
      const errMsg = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-4 lg:-m-6">
      <div
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } transition-all duration-300 overflow-hidden`}
      >
        <ChatSidebar
          chats={chats}
          onNew={handleNewChat}
          onDelete={handleDeleteChat}
          currentId={chatId}
        />
      </div>

      <div className="flex flex-1 flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50">
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 p-5 shadow-xl shadow-purple-500/20">
                  <MessageSquare className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 shadow-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Ask about your documents
              </h2>
              <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                Upload PDFs in the Documents section, then ask questions here.
                ArcMind will search your documents for answers.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { q: 'What is the total amount?', icon: '💰' },
                  { q: 'Summarize this document', icon: '📄' },
                  { q: 'Who are the parties involved?', icon: '👥' },
                ].map(({ q, icon }) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="group rounded-xl border border-gray-200 bg-white p-3 text-left text-xs text-gray-600 shadow-sm transition-all hover:border-arc-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-arc-600"
                  >
                    <span className="mb-1 block text-base">{icon}</span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map((msg, i) => (
                <ChatMessage key={msg.id || i} message={msg} />
              ))}
              {sending && (
                <div className="flex items-center gap-3 fade-in">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/20">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="rounded-2xl border border-gray-200/80 bg-white px-5 py-3.5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-arc-500" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-arc-500" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-arc-500" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="mx-auto w-full max-w-3xl px-4 pb-4">
          <ChatInput onSend={handleSend} disabled={sending} />
        </div>
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-r-xl border border-l-0 border-gray-200/80 bg-white p-2 shadow-sm backdrop-blur-md transition-all hover:bg-gray-50 dark:border-gray-700/50 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className={`h-4 w-4 transition-transform duration-200 ${sidebarOpen ? '' : 'rotate-180'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </button>
    </div>
  );
}
