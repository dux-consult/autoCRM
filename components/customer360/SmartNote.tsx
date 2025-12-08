import React, { useState, useEffect, useRef } from 'react';
import { CustomerNote } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../ui';
import { StickyNote, Pin, Mic, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { customerNoteService } from '../../services/customerNoteService';

interface SmartNoteProps {
    customerId: string;
    notes: CustomerNote[];
    onNotesChange: (notes: CustomerNote[]) => void;
}

export const SmartNote: React.FC<SmartNoteProps> = ({ customerId, notes, onNotesChange }) => {
    const { t } = useLanguage();
    const [newNote, setNewNote] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
    const recognitionRef = useRef<any>(null);

    // Voice input setup
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'th-TH';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join('');
                setNewNote(transcript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert(t('speechNotSupported') || 'เบราว์เซอร์ไม่รองรับการพูด');
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        try {
            const created = await customerNoteService.createNote({
                customer_id: customerId,
                content: newNote.trim(),
                is_pinned: false
            });
            onNotesChange([created, ...notes]);
            setNewNote('');
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    const handleTogglePin = async (note: CustomerNote) => {
        try {
            const updated = await customerNoteService.togglePin(note.id, note.is_pinned);
            const updatedNotes = notes.map(n => n.id === note.id ? updated : n);
            // Sort: pinned first, then by updated_at
            updatedNotes.sort((a, b) => {
                if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
                return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
            });
            onNotesChange(updatedNotes);
        } catch (error) {
            console.error('Error toggling pin:', error);
        }
    };

    const handleEditNote = (note: CustomerNote) => {
        setEditingId(note.id);
        setEditContent(note.content);
    };

    const handleSaveEdit = async (noteId: string) => {
        try {
            const updated = await customerNoteService.updateNote(noteId, { content: editContent });
            onNotesChange(notes.map(n => n.id === noteId ? updated : n));
            setEditingId(null);
            setEditContent('');
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!confirm(t('confirmDeleteNote') || 'ลบ Note นี้?')) return;

        try {
            await customerNoteService.deleteNote(noteId);
            onNotesChange(notes.filter(n => n.id !== noteId));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    // Auto-save for editing
    const handleEditChange = (value: string, noteId: string) => {
        setEditContent(value);

        if (saveTimeout) clearTimeout(saveTimeout);
        setSaveTimeout(setTimeout(() => {
            handleSaveEdit(noteId);
        }, 1000));
    };

    return (
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50/50">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-amber-600" />
                    {t('smartNote') || 'Smart Note'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* New Note Input */}
                <div className="space-y-2">
                    <div className="relative">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder={t('writeNote') || 'เขียนโน้ต...'}
                            className="w-full px-3 py-2 pr-10 bg-white border border-amber-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
                            rows={3}
                        />
                        <button
                            onClick={toggleRecording}
                            className={`absolute bottom-2 right-2 p-2 rounded-full transition-colors ${isRecording
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            title={t('voiceInput') || 'พิมพ์ด้วยเสียง'}
                        >
                            <Mic className="w-4 h-4" />
                        </button>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className="w-full gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('addNote') || 'เพิ่ม Note'}
                    </Button>
                </div>

                {/* Notes List */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {notes.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">
                            {t('noNotes') || 'ยังไม่มี Note'}
                        </p>
                    )}
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className={`p-3 rounded-lg border transition-all ${note.is_pinned
                                    ? 'bg-amber-100 border-amber-300 shadow-sm'
                                    : 'bg-white border-gray-200'
                                }`}
                        >
                            {editingId === note.id ? (
                                <textarea
                                    value={editContent}
                                    onChange={(e) => handleEditChange(e.target.value, note.id)}
                                    className="w-full px-2 py-1 text-sm border rounded resize-none"
                                    rows={2}
                                    autoFocus
                                    onBlur={() => setEditingId(null)}
                                />
                            ) : (
                                <div onClick={() => handleEditNote(note)} className="cursor-pointer">
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">
                                    {new Date(note.updated_at).toLocaleDateString('th-TH', {
                                        day: 'numeric', month: 'short'
                                    })}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleTogglePin(note)}
                                        className={`p-1 rounded transition-colors ${note.is_pinned
                                                ? 'text-amber-600 bg-amber-200'
                                                : 'text-gray-400 hover:text-amber-600 hover:bg-amber-100'
                                            }`}
                                        title={t('pinNote') || 'ปักหมุด'}
                                    >
                                        <Pin className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-100 transition-colors"
                                        title={t('deleteNote') || 'ลบ'}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
