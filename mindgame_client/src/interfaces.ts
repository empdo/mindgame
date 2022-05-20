export interface User {
  name: string;
  readyState: boolean;
  local: boolean;
}

export interface BaseEvent {
  type: ActionType;
  data: unknown;
}

export interface PlayerJoinEvent extends BaseEvent {
  type: ActionType.PlayerJoin;
  data: User[];
}
export interface StartedEvent extends BaseEvent {
  type: ActionType.Started;
  data: boolean;
}
export interface YourCardsEvent extends BaseEvent {
  type: ActionType.YourCards;
  data: number[];
}
export interface DealtCardsEvent extends BaseEvent {
  type: ActionType.DealtCards;
  data: number[];
}

export interface LivesEvent extends BaseEvent {
  type: ActionType.Lives;
  data: number;
}

export type GameEvent =
  | PlayerJoinEvent
  | StartedEvent
  | YourCardsEvent
  | DealtCardsEvent
  | LivesEvent;

export enum ActionType {
  PlayerJoin = 1,
  Started = 2,
  YourCards = 3,
  DealtCards = 4,
  Lives = 5,
}

export interface LobbyState {
  players: User[];
  started: boolean;
  ready: boolean;
  dealtCards: number[];
  yourCards: number[];
  lives: number;
}
