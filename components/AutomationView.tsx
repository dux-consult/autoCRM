import React, { useState } from 'react';
import { JourneyList } from './JourneyList';
import { JourneyBuilder } from './JourneyBuilder';
import { MessageTemplateList } from './MessageTemplateList';

export const AutomationView = () => {
    const [view, setView] = useState<'list' | 'builder' | 'templates'>('list');
    const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);

    const handleCreateNew = () => {
        setSelectedJourneyId(null);
        setView('builder');
    };

    const handleEdit = (id: string) => {
        setSelectedJourneyId(id);
        setView('builder');
    };

    const handleBack = () => {
        setView('list');
        setSelectedJourneyId(null);
    };

    if (view === 'builder') {
        return <JourneyBuilder journeyId={selectedJourneyId} onBack={handleBack} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setView('list')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Workflow Journeys
                </button>
                <button
                    onClick={() => setView('templates')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'templates'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Message Templates
                </button>
            </div>

            {view === 'list' ? (
                <JourneyList onCreateNew={handleCreateNew} onEdit={handleEdit} />
            ) : (
                <MessageTemplateList />
            )}
        </div>
    );
};
