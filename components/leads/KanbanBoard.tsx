
import React, { useMemo } from 'react';
import { Lead, LeadStage } from '../../types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
    leads: Lead[];
    productMap: Map<string, string>;
    onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
    onEditLead: (lead: Lead) => void;
    onChat: (lead: Lead) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, productMap, onUpdateLeadStage, onEditLead, onChat }) => {
    const leadsByStage = useMemo(() => {
        const board = {
            [LeadStage.ON_PROGRESS]: [] as Lead[],
            [LeadStage.CLOSING]: [] as Lead[],
            [LeadStage.LOSS]: [] as Lead[],
        };
        leads.forEach(lead => {
            if (board[lead.stage]) {
                board[lead.stage].push(lead);
            }
        });
        return board;
    }, [leads]);

    return (
        <div className="flex space-x-4 overflow-x-auto pb-4">
            {Object.entries(leadsByStage).map(([stage, stageLeads]) => (
                <KanbanColumn
                    key={stage}
                    stage={stage as LeadStage}
                    leads={stageLeads}
                    productMap={productMap}
                    onUpdateLeadStage={onUpdateLeadStage}
                    onEditLead={onEditLead}
                    onChat={onChat}
                />
            ))}
        </div>
    );
};
