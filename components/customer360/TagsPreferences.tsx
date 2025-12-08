import React, { useState } from 'react';
import { Customer } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import { Tag, X, Plus } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';

interface TagsPreferencesProps {
    customer: Customer;
    onUpdate: (updates: Partial<Customer>) => void;
}

const SUGGESTED_TAGS = ['VIP', 'เรื่องมาก', 'ชอบส่วนลด', 'ซื้อบ่อย', 'ต้องการดูแล', 'ผ่อน', 'เงินสด'];

export const TagsPreferences: React.FC<TagsPreferencesProps> = ({ customer, onUpdate }) => {
    const { t } = useLanguage();
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const tags = customer.tags || [];

    const handleAddTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            onUpdate({ tags: [...tags, trimmedTag] });
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onUpdate({ tags: tags.filter(t => t !== tagToRemove) });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag(inputValue);
        }
    };

    const filteredSuggestions = SUGGESTED_TAGS.filter(
        tag => !tags.includes(tag) && tag.toLowerCase().includes(inputValue.toLowerCase())
    );

    const getTagColor = (tag: string) => {
        // Different colors based on tag content
        if (tag.toLowerCase().includes('vip')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (tag.toLowerCase().includes('เรื่องมาก') || tag.toLowerCase().includes('ดูแล'))
            return 'bg-red-100 text-red-800 border-red-200';
        if (tag.toLowerCase().includes('ส่วนลด')) return 'bg-green-100 text-green-800 border-green-200';
        return 'bg-blue-100 text-blue-800 border-blue-200';
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    {t('tagsAndPreferences') || 'Tags & ความชอบ'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Tags Display */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.length === 0 && (
                        <span className="text-sm text-gray-400">{t('noTags') || 'ยังไม่มี tag'}</span>
                    )}
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                        >
                            #{tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:bg-black/10 rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>

                {/* Add Tag Input */}
                <div className="relative">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('addTag') || 'เพิ่ม tag...'}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <button
                            onClick={() => handleAddTag(inputValue)}
                            disabled={!inputValue.trim()}
                            className="px-3 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                            {filteredSuggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => handleAddTag(suggestion)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Tag className="w-3 h-3 text-gray-400" />
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Click outside to close suggestions */}
                {showSuggestions && (
                    <div
                        className="fixed inset-0 z-0"
                        onClick={() => setShowSuggestions(false)}
                    />
                )}
            </CardContent>
        </Card>
    );
};
