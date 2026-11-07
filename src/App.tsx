import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { NewReportModal } from './components/NewReportModal';
import { OverviewView } from './components/views/OverviewView';
import { FarmersView } from './components/views/FarmersView';
import { ReportsView } from './components/views/ReportsView';
import { AgentWorkspaceView } from './components/views/AgentWorkspaceView';
import { CropIntelligenceView } from './components/views/CropIntelligenceView';
import { MarketIntelligenceView } from './components/views/MarketIntelligenceView';
import { WeatherIntelligenceView } from './components/views/WeatherIntelligenceView';
import { CollaborationRoomsView } from './components/views/CollaborationRoomsView';
import { HumanApprovalsView } from './components/views/HumanApprovalsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { DownloadReportsView } from './components/views/DownloadReportsView';
import { SettingsView } from './components/views/SettingsView';
import { 
  INITIAL_FARMERS, 
  INITIAL_REPORTS, 
  INITIAL_ROOMS, 
  INITIAL_AGENTS, 
  INITIAL_ACTION_PLANS 
} from './data/mockData';
import { Farmer, FarmerReport, SwitchCollaborationRoom, SwitchAgent, ActionPlan } from './types';
import { switchClient } from './switch/switchAdapter';
import type { ActiveUserProfile } from './components/AuthModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [currentUser, setCurrentUser] = useState<ActiveUserProfile>(() => {
    try {
      const stored = localStorage.getItem('agricommand_active_user');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return {
      id: 'demo-coord-01',
      name: 'Dr. Sundaram (Agri Coordinator)',
      email: 'sundaram.agri@tamilnadu.gov.in',
      role: 'coordinator',
      organization: 'Department of Agricultural Extension, Salem'
    };
  });
  const [farmers, setFarmers] = useState<Farmer[]>(INITIAL_FARMERS);
  const [reports, setReports] = useState<FarmerReport[]>(INITIAL_REPORTS);
  const [rooms, setRooms] = useState<SwitchCollaborationRoom[]>(INITIAL_ROOMS);
  const [agents, setAgents] = useState<SwitchAgent[]>(INITIAL_AGENTS);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(INITIAL_ACTION_PLANS);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room-rep-001-salem');
  const [switchMode, setSwitchMode] = useState<'sandbox' | 'switch_live_gateway'>('sandbox');
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [modalInitialFarmerId, setModalInitialFarmerId] = useState<string | undefined>(undefined);
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false);
  const [isResettingDemo, setIsResettingDemo] = useState(false);

  // Load from backend on initial mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmersRes, reportsRes, roomsRes, approvalsRes, agentsRes, switchRes] = await Promise.allSettled([
          fetch('/api/farmers'),
          fetch('/api/reports'),
          fetch('/api/rooms'),
          fetch('/api/approvals'),
          fetch('/api/agents'),
          fetch('/api/switch/config')
        ]);

        if (farmersRes.status === 'fulfilled' && farmersRes.value.ok) {
          const data = await farmersRes.value.json();
          if (Array.isArray(data) && data.length) setFarmers(data);
        }
        if (reportsRes.status === 'fulfilled' && reportsRes.value.ok) {
          const data = await reportsRes.value.json();
          if (Array.isArray(data) && data.length) setReports(data);
        }
        if (roomsRes.status === 'fulfilled' && roomsRes.value.ok) {
          const data = await roomsRes.value.json();
          if (Array.isArray(data) && data.length) {
            setRooms(data);
            setSelectedRoomId(data[0].id);
          }
        }
        if (approvalsRes.status === 'fulfilled' && approvalsRes.value.ok) {
          const data = await approvalsRes.value.json();
          if (Array.isArray(data) && data.length) setActionPlans(data);
        }
        if (agentsRes.status === 'fulfilled' && agentsRes.value.ok) {
          const data = await agentsRes.value.json();
          if (Array.isArray(data) && data.length) setAgents(data);
        }
        if (switchRes.status === 'fulfilled' && switchRes.value.ok) {
          const data = await switchRes.value.json();
          if (data?.mode) setSwitchMode(data.mode);
        }
      } catch (err) {
        console.warn('Backend sync note: using fast in-memory store.');
      }
    };

    fetchData();
  }, []);

  // Switch mode update
  const handleUpdateSwitchMode = async (mode: 'sandbox' | 'switch_live_gateway') => {
    setSwitchMode(mode);
    switchClient.updateConfig({ mode });
    try {
      await fetch('/api/switch/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
    } catch (e) {
      // offline ok
    }
  };

  // Farmer registration
  const handleAddFarmer = async (farmerData: any) => {
    try {
      const res = await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmerData)
      });
      if (res.ok) {
        const created = await res.json();
        setFarmers(prev => [created, ...prev]);
      } else {
        throw new Error('Failed to create farmer on backend');
      }
    } catch (e) {
      const fallbackFarmer = {
        ...farmerData,
        id: `farmer-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setFarmers(prev => [fallbackFarmer, ...prev]);
    }
  };

  // Farmer problem submission
  const handleSubmitReport = async (formData: any) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const { report, room } = await res.json();
        setReports(prev => [report, ...prev]);
        setRooms(prev => [room, ...prev]);
        setSelectedRoomId(room.id);
        setCurrentTab('rooms');
        // trigger workflow
        handleRunWorkflow(report.id);
      }
    } catch (err) {
      const reportId = `REP-2026-SLM-${String(reports.length + 1).padStart(3, '0')}`;
      const roomId = `room-${reportId.toLowerCase()}`;
      const newReport: FarmerReport = {
        ...formData,
        id: reportId,
        roomId,
        status: 'Submitted',
        assignedAgents: ['Agri-Triage'],
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const newRoom: SwitchCollaborationRoom = {
        id: roomId,
        reportId,
        title: `${newReport.farmerName} – ${newReport.category} [${newReport.district}]`,
        topic: `Multi-agent collaboration for ${newReport.farmerName}`,
        createdAt: new Date().toISOString(),
        status: 'active',
        switchServerMode: switchMode,
        members: [
          { id: 'human-coord', name: 'Dr. Sundaram (Agri Coordinator)', type: 'human', role: 'Chief Agricultural Coordinator', status: 'Online' },
          { id: 'agent-triage', name: 'Agri-Triage', type: 'agent', role: 'Triage Specialist', status: 'Online' },
          { id: 'agent-cropmind', name: 'CropMind', type: 'agent', role: 'Agronomist & ML Model', status: 'Online' },
          { id: 'agent-marketpulse', name: 'MarketPulse', type: 'agent', role: 'Market Analyst', status: 'Online' },
          { id: 'agent-weatherguard', name: 'WeatherGuard', type: 'agent', role: 'Meteorologist', status: 'Online' },
          { id: 'agent-agrireport', name: 'AgriReport', type: 'agent', role: 'Synthesis & Reporting', status: 'Online' }
        ],
        messages: [
          {
            id: `msg-${Date.now()}-farmer`,
            roomId,
            senderType: 'farmer',
            senderId: newReport.farmerId,
            senderName: `${newReport.farmerName} (Farmer)`,
            messageType: 'chat',
            content: newReport.problemDescription,
            timestamp: new Date().toISOString()
          }
        ]
      };
      setReports(prev => [newReport, ...prev]);
      setRooms(prev => [newRoom, ...prev]);
      setSelectedRoomId(roomId);
      setCurrentTab('rooms');
      handleRunWorkflow(reportId);
    }
  };

  // Run Multi-Agent Workflow
  const handleRunWorkflow = async (reportId: string) => {
    setIsRunningWorkflow(true);
    try {
      const res = await fetch('/api/workflow/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId })
      });

      if (res.ok) {
        const data = await res.json();
        // Update report
        setReports(prev => prev.map(r => r.id === reportId ? data.report : r));
        // Update room
        setRooms(prev => prev.map(rm => rm.id === data.room.id ? data.room : rm));
        // Update action plan
        setActionPlans(prev => {
          const exists = prev.some(p => p.id === data.actionPlan.id);
          if (exists) {
            return prev.map(p => p.id === data.actionPlan.id ? data.actionPlan : p);
          }
          return [data.actionPlan, ...prev];
        });
        setSelectedRoomId(data.room.id);
      }
    } catch (err) {
      console.error('Workflow runner error:', err);
    } finally {
      setIsRunningWorkflow(false);
    }
  };

  // Send message in room
  const handleSendMessage = async (roomId: string, messageData: any) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      if (res.ok) {
        const newMsg = await res.json();
        setRooms(prev => prev.map(r => {
          if (r.id === roomId) {
            return { ...r, messages: [...r.messages, newMsg] };
          }
          return r;
        }));
      }
    } catch (err) {
      const localMsg = {
        ...messageData,
        id: `msg-${Date.now()}`,
        roomId,
        timestamp: new Date().toISOString()
      };
      setRooms(prev => prev.map(r => {
        if (r.id === roomId) {
          return { ...r, messages: [...r.messages, localMsg] };
        }
        return r;
      }));
    }
  };

  // Human Review Decision
  const handleReviewDecision = async (
    planId: string, 
    decision: 'Approved' | 'Rejected' | 'Revision Requested', 
    comments: string
  ) => {
    try {
      const res = await fetch(`/api/approvals/${planId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          comments,
          reviewerName: currentUser.name
        })
      });

      if (res.ok) {
        const updatedPlan = await res.json();
        setActionPlans(prev => prev.map(p => p.id === planId ? updatedPlan : p));
        // update report status
        setReports(prev => prev.map(r => {
          if (r.id === updatedPlan.reportId) {
            return { ...r, status: decision === 'Approved' ? 'Approved' : decision === 'Rejected' ? 'Rejected' : 'Revision Requested' };
          }
          return r;
        }));

        // refresh rooms to see approval card
        const roomsRes = await fetch('/api/rooms');
        if (roomsRes.ok) {
          const updatedRooms = await roomsRes.json();
          setRooms(updatedRooms);
        }
      }
    } catch (err) {
      setActionPlans(prev => prev.map(p => {
        if (p.id === planId) {
          return {
            ...p,
            humanReviewStatus: decision,
            humanComments: comments,
            reviewerName: currentUser.name,
            reviewedAt: new Date().toISOString()
          };
        }
        return p;
      }));
    }
  };

  // Reset demonstration scenario
  const handleResetDemo = () => {
    setIsResettingDemo(true);
    setTimeout(() => {
      setFarmers([...INITIAL_FARMERS]);
      setReports([...INITIAL_REPORTS]);
      setRooms([...INITIAL_ROOMS]);
      setAgents([...INITIAL_AGENTS]);
      setActionPlans([...INITIAL_ACTION_PLANS]);
      setSelectedRoomId('room-rep-001-salem');
      setCurrentTab('overview');
      setIsResettingDemo(false);
    }, 600);
  };

  const pendingApprovalsCount = actionPlans.filter(p => p.humanReviewStatus === 'Pending').length;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingApprovalsCount={pendingApprovalsCount}
        activeRoomsCount={rooms.length}
        switchMode={switchMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentTab={currentTab}
          currentUser={currentUser}
          onUpdateUser={setCurrentUser}
          onOpenNewReport={() => {
            setModalInitialFarmerId(undefined);
            setIsNewReportModalOpen(true);
          }}
          onResetDemo={handleResetDemo}
          isResetting={isResettingDemo}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950/80">
          {currentTab === 'overview' && (
            <OverviewView
              farmers={farmers}
              reports={reports}
              agents={agents}
              actionPlans={actionPlans}
              rooms={rooms}
              onNavigate={setCurrentTab}
              onRunWorkflow={handleRunWorkflow}
              isRunningWorkflow={isRunningWorkflow}
            />
          )}

          {currentTab === 'farmers' && (
            <FarmersView
              farmers={farmers}
              onSelectFarmerForReport={(farmerId) => {
                setModalInitialFarmerId(farmerId);
                setIsNewReportModalOpen(true);
              }}
              onAddFarmer={handleAddFarmer}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              reports={reports}
              onNavigate={setCurrentTab}
              onRunWorkflow={handleRunWorkflow}
              isRunningWorkflow={isRunningWorkflow}
            />
          )}

          {currentTab === 'agents' && (
            <AgentWorkspaceView agents={agents} />
          )}

          {currentTab === 'crop' && (
            <CropIntelligenceView />
          )}

          {currentTab === 'market' && (
            <MarketIntelligenceView />
          )}

          {currentTab === 'weather' && (
            <WeatherIntelligenceView />
          )}

          {currentTab === 'rooms' && (
            <CollaborationRoomsView
              rooms={rooms}
              agents={agents}
              reports={reports}
              selectedRoomId={selectedRoomId}
              onSelectRoom={setSelectedRoomId}
              onSendMessage={handleSendMessage}
              onRunWorkflow={handleRunWorkflow}
              isRunningWorkflow={isRunningWorkflow}
              onNavigate={setCurrentTab}
              switchMode={switchMode}
            />
          )}

          {currentTab === 'approvals' && (
            <HumanApprovalsView
              actionPlans={actionPlans}
              reports={reports}
              onReviewDecision={handleReviewDecision}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView />
          )}

          {currentTab === 'downloads' && (
            <DownloadReportsView
              actionPlans={actionPlans}
              reports={reports}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              switchMode={switchMode}
              onUpdateSwitchMode={handleUpdateSwitchMode}
              onSaveConfig={async (cfg) => {
                try {
                  await fetch('/api/switch/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cfg)
                  });
                } catch (e) {
                  // offline fallback
                }
              }}
              onResetDemo={handleResetDemo}
              isResetting={isResettingDemo}
            />
          )}
        </main>
      </div>

      {/* New Report Modal */}
      <NewReportModal
        isOpen={isNewReportModalOpen}
        initialFarmerId={modalInitialFarmerId}
        onClose={() => setIsNewReportModalOpen(false)}
        onSubmit={handleSubmitReport}
        farmers={farmers}
      />
    </div>
  );
}
