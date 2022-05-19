export interface User {
  name: string;
  readyState: boolean;
}

export interface BaseEvent {
  type: ActionType;
  data: unknown;
}

export interface PlayerJoinEvent extends BaseEvent {
  type: ActionType.PlayerJoin;
  data: User;
}

export type GameEvent = BaseEvent | PlayerJoinEvent;

export enum ActionType {
  PlayerJoin = 1,
  Started = 2,
  YouCards = 3,
  DealtCards = 4,
  Lives = 5,
}
