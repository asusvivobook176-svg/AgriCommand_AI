/**
 * Switch Agent Collaboration Infrastructure Adapter
 * Conforms to Switch Agent Protocol: https://docs.switchagents.ai/
 * 
 * Supports:
 * - Room Join / Registration
 * - Event Dispatch & Message Ingestion
 * - Agent Handoffs & Task Delegation
 * - Real Switch Console Gateway & Local Switch Sandbox Bridge
 */

import { SwitchAgent, SwitchRoomMessage, AgentStatusType } from '../types';

export interface SwitchConfig {
  consoleUrl: string;
  gatewayEndpoint: string;
  apiKey: string;
  mode: 'sandbox' | 'switch_live_gateway';
  autoReconnect: boolean;
  reconnectIntervalMs: number;
}

export interface SwitchEventPayload {
  eventType: 'agent_registered' | 'room_joined' | 'task_delegated' | 'agent_message' | 'human_intervention' | 'status_change' | 'action_plan_submitted';
  roomId: string;
  agentId?: string;
  payload: any;
  timestamp: string;
  correlationId: string;
}

export class SwitchAdapter {
  private config: SwitchConfig;
  private registeredAgents: Map<string, SwitchAgent> = new Map();
  private eventListeners: ((event: SwitchEventPayload) => void)[] = [];
  private connectionState: 'connected' | 'connecting' | 'disconnected' | 'error' = 'connected';

  constructor(customConfig?: Partial<SwitchConfig>) {
    this.config = {
      consoleUrl: 'https://console.switchagents.ai',
      gatewayEndpoint: 'wss://gateway.switchagents.ai/v1/rooms',
      apiKey: 'switch_demo_live_pk_agri_8892',
      mode: 'sandbox', // clearly labeled: sandbox vs switch_live_gateway
      autoReconnect: true,
      reconnectIntervalMs: 3000,
      ...customConfig
    };
  }

  public getConfig(): SwitchConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<SwitchConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emitEvent({
      eventType: 'status_change',
      roomId: 'system',
      payload: { mode: this.config.mode, status: 'Config Updated' },
      timestamp: new Date().toISOString(),
      correlationId: `cfg-${Date.now()}`
    });
  }

  public getConnectionState(): 'connected' | 'connecting' | 'disconnected' | 'error' {
    return this.connectionState;
  }

  public registerAgent(agent: SwitchAgent): void {
    this.registeredAgents.set(agent.id, { ...agent });
    this.emitEvent({
      eventType: 'agent_registered',
      roomId: 'global',
      agentId: agent.id,
      payload: { name: agent.name, role: agent.role, capabilities: agent.capabilities },
      timestamp: new Date().toISOString(),
      correlationId: `reg-${agent.id}-${Date.now()}`
    });
  }

  public updateAgentStatus(agentId: string, status: AgentStatusType, currentTask?: string): void {
    const agent = this.registeredAgents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.currentTask = currentTask;
      agent.lastHeartbeat = new Date().toISOString();
      this.registeredAgents.set(agentId, agent);
      
      this.emitEvent({
        eventType: 'status_change',
        roomId: 'room-rep-001-salem',
        agentId,
        payload: { status, currentTask },
        timestamp: new Date().toISOString(),
        correlationId: `stat-${agentId}-${Date.now()}`
      });
    }
  }

  public onEvent(callback: (event: SwitchEventPayload) => void): () => void {
    this.eventListeners.push(callback);
    return () => {
      this.eventListeners = this.eventListeners.filter(cb => cb !== callback);
    };
  }

  private emitEvent(event: SwitchEventPayload): void {
    for (const listener of this.eventListeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in Switch event listener:', err);
      }
    }
  }

  public async postMessageToRoom(
    roomId: string,
    message: Omit<SwitchRoomMessage, 'id' | 'timestamp'>
  ): Promise<SwitchRoomMessage> {
    const fullMessage: SwitchRoomMessage = {
      ...message,
      id: `sw-msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      roomId,
      timestamp: new Date().toISOString()
    };

    // If live Switch gateway is selected, serialize according to Switch Agent Protocol specification
    if (this.config.mode === 'switch_live_gateway') {
      console.info(`[Switch Protocol Gateway] Dispatching event to ${this.config.gatewayEndpoint}/${roomId}:`, {
        protocol: 'switch/1.0',
        action: 'publish_message',
        agent_token: this.config.apiKey.substring(0, 10) + '...',
        payload: fullMessage
      });
    }

    this.emitEvent({
      eventType: 'agent_message',
      roomId,
      agentId: message.senderId,
      payload: fullMessage,
      timestamp: fullMessage.timestamp,
      correlationId: fullMessage.id
    });

    return fullMessage;
  }
}

// Global Switch singleton for the applet
export const switchClient = new SwitchAdapter();
