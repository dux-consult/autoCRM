import React from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'th' ? 'en' : 'th');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
            title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
        >
            <Globe className="w-5 h-5" />
            <span className="text-xs font-medium uppercase w-4 text-center">
                {language}
            </span>
        </button>
    );
};
