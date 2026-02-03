
import { PortfolioItem, RitualStep, ScheduleEvent } from './types';

export const COLORS = {
  black: '#000000',
  crimson: '#8B0000',
  gold: '#C5A059',
  grayDeep: '#1A1A1A',
  grayLight: '#A0A0A0',
};

export const PORTFOLIO_DATA: PortfolioItem[] = [
  { id: '1', title: 'Espírito do Tigre', category: 'Blackwork', image: 'https://images.unsplash.com/photo-1621244464174-da75a64603b0?auto=format&fit=crop&q=80&w=1000' },
  { id: '2', title: 'Fluxo do Dragão', category: 'Irezumi', image: 'https://images.unsplash.com/photo-1562158074-274270088194?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Silêncio de Lótus', category: 'Fine Line', image: 'https://images.unsplash.com/photo-1560707854-fb9a10eeaace?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'A Grande Onda', category: 'Blackwork', image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=1000' },
  { id: '5', title: 'Alma Samurai', category: 'Irezumi', image: 'https://images.unsplash.com/photo-1568515045052-f9ad854a7092?auto=format&fit=crop&q=80&w=800' },
  { id: '6', title: 'Máscara Oni', category: 'Tradition', image: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=800' },
];

export const RITUAL_STEPS: RitualStep[] = [
  { number: '01', title: 'O Chamado', description: 'Uma imersão profunda na sua história, mapeando o fluxo da tinta para sua anatomia única.' },
  { number: '02', title: 'A Alquimia', description: 'Desenho sagrado e manual. Refinamos a alma visual da sua peça antes da primeira agulha.' },
  { number: '03', title: 'A Imersão', description: 'Uma sessão meditativa de resiliência. Técnicas tradicionais encontram a precisão visceral.' },
  { number: '04', title: 'O Legado', description: 'A cura é parte da arte. Orientação especializada para preservar a eternidade da sombra.' },
];

export const SCHEDULE_DATA: ScheduleEvent[] = [
  { time: '12:00 PM', title: 'Performance ao Vivo', description: 'EXECUÇÃO DE LARGE-SCALE BACKPIECE', date: '15 MAI' },
  { time: '03:00 PM', title: 'Consultoria Privada', description: 'SLOTS EXCLUSIVOS PARA DESENHOS AUTORAIS', date: '16 MAI' },
  { time: '07:00 PM', title: 'Exposição das Sombras', description: 'GALERIA CURADA DE OBRAS FINALIZADAS', date: '17 MAI' },
];
