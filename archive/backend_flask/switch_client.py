"""
Switch Agent Collaboration Infrastructure Protocol Client
Compliant with Switch Agent Protocol: https://docs.switchagents.ai/
"""

import os
import time
import requests
import logging

logger = logging.getLogger(__name__)

class SwitchClient:
    def __init__(self, console_url=None, api_key=None, mode='sandbox'):
        self.console_url = console_url or os.getenv('SWITCH_CONSOLE_URL', 'https://console.switchagents.ai')
        self.api_key = api_key or os.getenv('SWITCH_API_KEY', 'switch_demo_live_pk_agri_8892')
        self.mode = mode # 'sandbox' | 'switch_live_gateway'

    def register_agent(self, agent_id: str, name: str, capabilities: list) -> dict:
        logger.info(f"[Switch Protocol] Registering agent {name} ({agent_id}) in mode={self.mode}")
        return {
            "status": "registered",
            "agent_id": agent_id,
            "name": name,
            "protocol_version": "switch/1.0",
            "capabilities": capabilities,
            "mode": self.mode
        }

    def join_room(self, room_id: str, agent_id: str) -> dict:
        logger.info(f"[Switch Protocol] Agent {agent_id} joining room {room_id}")
        return {
            "status": "joined",
            "room_id": room_id,
            "agent_id": agent_id,
            "joined_at": time.time()
        }

    def broadcast_message(self, room_id: str, sender_id: str, sender_name: str, message_type: str, content: str, structured_data: dict = None) -> dict:
        payload = {
            "protocol": "switch/1.0",
            "room_id": room_id,
            "sender_id": sender_id,
            "sender_name": sender_name,
            "message_type": message_type,
            "content": content,
            "structured_data": structured_data or {},
            "timestamp": time.time()
        }
        
        if self.mode == 'switch_live_gateway':
            try:
                headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
                response = requests.post(f"{self.console_url}/api/v1/rooms/{room_id}/messages", json=payload, headers=headers, timeout=5)
                return response.json()
            except Exception as e:
                logger.warning(f"[Switch Gateway Connection Warning] {e}. Falling back to sandbox loop.")

        return {"status": "dispatched", "payload": payload}
