
export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  span?: string;
}

export interface RitualStep {
  number: string;
  title: string;
  description: string;
}

export interface ScheduleEvent {
  time: string;
  title: string;
  description: string;
  date: string;
}
