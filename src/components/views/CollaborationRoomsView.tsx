import React, { useState } from 'react';
import { 
  MessagesSquare, 
  Send, 
  Bot, 
  User, 
  Radio, 
  PlayCircle, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Sprout,
  TrendingUp,
  CloudSun,
  FileText,
  CornerDownRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { SwitchCollaborationRoom, SwitchRoomMessage, SwitchAgent, FarmerReport } from '../../types';
import { NavTab } from '../Sidebar';

interface CollaborationRoomsViewProps {
  rooms: SwitchCollaborationRoom[];
  agents: SwitchAgent[];
  reports: FarmerReport[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onSendMessage: (roomId: string, messageData: any) => Promise<void>;
  onRunWorkflow: (reportId: string) => Promise<void>;
  isRunningWorkflow: boolean;
  onNavigate: (tab: NavTab) => void;
  switchMode: 'sandbox' | 'switch_live_gateway';
}

export const CollaborationRoomsView: React.FC<CollaborationRoomsViewProps> = ({
  rooms,
  agents,
  reports,
  selectedRoomId,
  onSelectRoom,
  onSendMessage,
  onRunWorkflow,
  isRunningWorkflow,
  onNavigate,
  switchMode
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const currentRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const associatedReport = reports.find(r => r.id === currentRoom?.reportId);

  const handleSendHumanMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentRoom) return;

    setIsSending(true);
    try {
      await onSendMessage(currentRoom.id, {
        senderType: 'human',
        senderId: 'human-coord',
        senderName: 'Dr. Sundaram (Agri Coordinator)',
        role: 'Chief Agricultural Coordinator',
        messageType: 'chat',
        content: inputText
      });
      setInputText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <div className="space-y-4">
      {/* Switch Protocol Connection Header */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Switch Collaboration Infrastructure Active</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                {switchMode === 'sandbox' ? 'Local Sandbox Adapter' : 'Switch Live Gateway'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Protocol: <span className="font-mono text-slate-300">Switch/1.0</span> • Room: <span className="font-mono text-emerald-400">#{currentRoom?.id}</span> • Compliant with docs.switchagents.ai
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {associatedReport && (
            <button
              onClick={() => onRunWorkflow(associatedReport.id)}
              disabled={isRunningWorkflow}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
            >
              <PlayCircle className={`w-3.5 h-3.5 ${isRunningWorkflow ? 'animate-spin' : ''}`} />
              <span>{isRunningWorkflow ? 'Agents Collaborating...' : 'Trigger Multi-Agent Collaboration'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('approvals')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Human Approvals</span>
          </button>
        </div>
      </div>

      {/* Main Room Layout: Left Room Selector & Participants, Right Live Chat Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column: Room Switcher & Active Agent Participants */}
        <div className="space-y-4">
          {/* Room Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Switch Rooms</h3>
            <div className="space-y-1.5">
              {rooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition border ${
                    room.id === currentRoom?.id
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-white shadow-sm'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold truncate">{room.title}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{room.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Participants in Current Room */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Room Members (6)</h3>
            <div className="space-y-2.5">
              {/* Human Coordinator */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300 font-bold text-[10px]">
                    DS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Dr. Sundaram</div>
                    <div className="text-[9px] text-slate-400">Chief Coordinator (Human)</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
              </div>

              {/* 5 AI Agents */}
              {agents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${agent.avatarColor} flex items-center justify-center text-white font-bold text-[10px]`}>
                      {agent.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{agent.name}</div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[120px]">{agent.role}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                    agent.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    agent.status === 'Working' ? 'bg-blue-500/10 text-blue-400 animate-pulse' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Message Feed & Human Interaction Bar */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[700px] shadow-xl overflow-hidden">
          {/* Room Header Info */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentRoom?.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {currentRoom?.status}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{currentRoom?.topic}</p>
            </div>

            <div className="text-xs text-slate-400 hidden sm:block text-right">
              <span className="block font-mono text-[10px] text-emerald-400">Switch Room Gateway Active</span>
              <span className="text-[11px]">{currentRoom?.messages.length} Events Logged</span>
            </div>
          </div>

          {/* Workflow Stepper Bar */}
          <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between overflow-x-auto text-[11px] gap-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium shrink-0">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Farmer Submission</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium shrink-0">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Agri-Triage</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium shrink-0">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>3 Specialists (Crop, Market, Weather)</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium shrink-0">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold">4</span>
              <span>AgriReport Synthesis</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-medium shrink-0">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-bold">5</span>
              <span>Human Approval</span>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentRoom?.messages.map((msg) => {
              const isFarmer = msg.senderType === 'farmer';
              const isHuman = msg.senderType === 'human';
              const isAgent = msg.senderType === 'agent';

              return (
                <div key={msg.id} className="space-y-1.5 text-xs">
                  {/* Sender Header */}
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] text-white ${
                      isFarmer ? 'bg-amber-600' :
                      isHuman ? 'bg-emerald-700' :
                      msg.senderId === 'agent-triage' ? 'bg-emerald-600' :
                      msg.senderId === 'agent-cropmind' ? 'bg-green-700' :
                      msg.senderId === 'agent-marketpulse' ? 'bg-amber-600' :
                      msg.senderId === 'agent-weatherguard' ? 'bg-cyan-600' :
                      'bg-indigo-600'
                    }`}>
                      {msg.senderName.substring(0, 2).toUpperCase()}
                    </span>

                    <span className="font-bold text-white">{msg.senderName}</span>
                    {msg.role && <span className="text-[10px] text-slate-400">({msg.role})</span>}
                    <span className="text-[10px] text-slate-400 font-mono ml-auto">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Bubble & Specialized Cards */}
                  <div className={`p-3.5 rounded-xl border leading-relaxed ${
                    isFarmer ? 'bg-amber-950/20 border-amber-500/30 text-amber-100' :
                    isHuman ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100' :
                    msg.messageType === 'triage_card' ? 'bg-slate-950/80 border-emerald-500/40 text-slate-200' :
                    msg.messageType === 'crop_recommendation_card' ? 'bg-slate-950/80 border-green-500/40 text-slate-200' :
                    msg.messageType === 'market_card' ? 'bg-slate-950/80 border-amber-500/40 text-slate-200' :
                    msg.messageType === 'weather_card' ? 'bg-slate-950/80 border-cyan-500/40 text-slate-200' :
                    msg.messageType === 'action_plan_draft' ? 'bg-slate-950/90 border-indigo-500/50 text-slate-100 ring-1 ring-indigo-500/30' :
                    msg.messageType === 'approval_card' ? 'bg-amber-950/30 border-amber-500/50 text-amber-100' :
                    'bg-slate-950/60 border-slate-800 text-slate-200'
                  }`}>
                    <p>{msg.content}</p>

                    {/* Render Structured Data Cards if present */}
                    {msg.structuredData && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                        {Object.entries(msg.structuredData).map(([key, val]) => (
                          <div key={key} className="bg-slate-900/80 p-2 rounded border border-slate-800">
                            <span className="text-slate-400 block uppercase text-[9px]">{key}</span>
                            <span className="text-emerald-300 font-semibold truncate block">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Direct Action Link if Action Plan Draft */}
                    {msg.messageType === 'action_plan_draft' && (
                      <div className="mt-3 flex items-center justify-end">
                        <button
                          onClick={() => onNavigate('approvals')}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Review & Approve Plan in Workspace</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Prompts For Human Coordinator */}
          <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 shrink-0 flex items-center gap-1">
              <CornerDownRight className="w-3 h-3 text-emerald-400" />
              <span>Coordinator Prompts:</span>
            </span>
            <button
              onClick={() => handleQuickPrompt("Dr. Sundaram: Confirming bio-fertilizer Azospirillum package dosage for red soil moisture retention.")}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shrink-0 transition"
            >
              + Bio-fertilizer dosage
            </button>
            <button
              onClick={() => handleQuickPrompt("Dr. Sundaram: Please evaluate if drip irrigation subsidy can be coordinated with Salem Horticulture Dept.")}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shrink-0 transition"
            >
              + Drip subsidy inquiry
            </button>
            <button
              onClick={() => handleQuickPrompt("Dr. Sundaram: Requesting MarketPulse to verify Attur vs Salem mandi transport cost differential.")}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shrink-0 transition"
            >
              + Mandi transport check
            </button>
          </div>

          {/* Human Coordinator Message Input Form */}
          <form onSubmit={handleSendHumanMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Dr. Sundaram: Reply to agents, provide field context, or assign new tasks..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Room</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
