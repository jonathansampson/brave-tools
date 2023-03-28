export interface AdRecord {
  time: Date;
  type: string;
  action: string;
}

export interface Hour {
  hour: number;
  adsShown: AdRecord[];
}

export interface Day {
  date: Date;
  hours: Hour[];
}

export declare type History = Day[];
