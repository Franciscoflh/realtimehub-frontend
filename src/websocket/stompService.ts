import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import type { EntityId } from '@/types';
import { WS_URL } from '@/utils/constants';

type MessageHandler = (message: IMessage) => void;
type StatusHandler = (connected: boolean) => void;

class StompService {
  private client: Client | null = null;
  private subscriptions = new Map<string, StompSubscription>();
  private pendingSubscriptions = new Map<string, MessageHandler>();
  private statusListeners = new Set<StatusHandler>();

  async connect(token: string, onConnect?: () => void, preferSockJS = false) {
    if (this.client?.active) {
      return;
    }

    let sockJsFactory: (() => WebSocket) | undefined;

    if (preferSockJS) {
      const module = await import('sockjs-client');
      const SockJS = module.default;
      sockJsFactory = () => new SockJS(WS_URL.replace(/^ws/, 'http')) as unknown as WebSocket;
    }

    this.client = new Client({
      brokerURL: preferSockJS ? undefined : WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => undefined,
      webSocketFactory: sockJsFactory,
      onConnect: () => {
        this.notifyStatus(true);
        this.resubscribeAll();
        onConnect?.();
      },
      onDisconnect: () => {
        this.notifyStatus(false);
      },
      onStompError: () => {
        this.notifyStatus(false);
      },
      onWebSocketClose: () => {
        this.notifyStatus(false);
      },
    });

    this.client.activate();
  }

  disconnect() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.clear();
    this.pendingSubscriptions.clear();
    this.client?.deactivate();
    this.client = null;
    this.notifyStatus(false);
  }

  subscribe(chatId: EntityId, handler: MessageHandler) {
    const chatKey = String(chatId);
    this.pendingSubscriptions.set(chatKey, handler);

    if (!this.client?.connected) {
      return;
    }

    this.subscriptions.get(chatKey)?.unsubscribe();
    const subscription = this.client.subscribe(`/topic/chats/${chatId}`, handler);
    this.subscriptions.set(chatKey, subscription);
  }

  unsubscribe(chatId: EntityId) {
    const chatKey = String(chatId);
    this.pendingSubscriptions.delete(chatKey);
    this.subscriptions.get(chatKey)?.unsubscribe();
    this.subscriptions.delete(chatKey);
  }

  sendMessage(chatId: EntityId, content: string) {
    if (!this.client?.connected) {
      throw new Error('WebSocket disconnected');
    }

    this.client.publish({
      destination: `/app/chats/${chatId}/messages`,
      body: JSON.stringify({ content }),
    });
  }

  addStatusListener(listener: StatusHandler) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  get isConnected() {
    return Boolean(this.client?.connected);
  }

  private resubscribeAll() {
    this.pendingSubscriptions.forEach((handler, chatId) => {
      this.subscribe(chatId, handler);
    });
  }

  private notifyStatus(connected: boolean) {
    this.statusListeners.forEach((listener) => listener(connected));
  }
}

export const stompService = new StompService();
