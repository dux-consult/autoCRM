import React, { useState } from 'react';
import { JourneyList } from './JourneyList';
import { JourneyBuilder } from './JourneyBuilder';

export const AutomationView = () => {
    const [view, setView] = useState<'list' | 'builder'>('list');
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

    return <JourneyList onCreateNew={handleCreateNew} onEdit={handleEdit} />;
};
