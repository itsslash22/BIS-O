import type { HeroCarouselItem } from './components/ui/hero-carousel';
import { PortfolioItem, RitualStep } from './types';

/**
 * Único lugar onde o link do WhatsApp existe. Sem parâmetros de rastreio
 * do Instagram/Facebook — eles vinham colados do "link na bio" e não fazem
 * sentido para quem chega pelo site.
 */
export const WHATSAPP_NUMBER = '5591993171598';
export const WHATSAPP_MESSAGE = 'Olá, tudo bem?! Gostaria de fazer um orçamento.';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const INSTAGRAM_LINK = 'https://www.instagram.com/bisaoink/';

export const STUDIO = {
  name: 'Cromia Tattoo Studio',
  street: 'R. 28 de Setembro, 600',
  district: 'Reduto',
  city: 'Belém',
  state: 'PA',
  postalCode: '66053-355',
  /**
   * TODO: CONFERIR. Estas coordenadas vieram de um texto decorativo do
   * componente de mapa antigo e apontam para o centro de Belém, não para a
   * porta do estúdio. Elas posicionam o pino do mapa e o campo `geo` do
   * JSON-LD no index.html — trocar nos dois lugares.
   * Como pegar: abrir o endereço no Google Maps, clicar com o botão direito
   * sobre o ponto exato e copiar o par latitude/longitude.
   */
  latitude: -1.4507,
  longitude: -48.4902,
  coordinates: '1.4507° S, 48.4902° W',
};

export const STUDIO_ADDRESS = `${STUDIO.street}, ${STUDIO.district}, ${STUDIO.city} - ${STUDIO.state}, ${STUDIO.postalCode}`;

/** Busca pelo endereço. Usado no texto do endereço e no rodapé. */
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STUDIO_ADDRESS)}`;

/**
 * Rota, não busca: abre o app já traçando o caminho a partir de onde a pessoa
 * está. É o que alguém quer de fato ao olhar o endereço de um estúdio.
 */
export const MAPS_DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  STUDIO_ADDRESS
)}`;

/** Waze tem uso pesado no Brasil e muita gente não abre o Google Maps. */
export const WAZE_LINK = `https://www.waze.com/ul?q=${encodeURIComponent(STUDIO_ADDRESS)}&navigate=yes`;

/**
 * Mapa embutido do OpenStreetMap: sem chave de API, sem conta de faturamento
 * e sem script do Google carregando na página. A moldura só entra no DOM
 * quando a pessoa pede — ver components/ui/expand-map.tsx.
 */
const BBOX_LON_DELTA = 0.0045; // ~500 m
const BBOX_LAT_DELTA = 0.0035;

// toFixed evita o lixo de ponto flutuante (-1.4542000000000002) na URL.
const bbox = [
  STUDIO.longitude - BBOX_LON_DELTA,
  STUDIO.latitude - BBOX_LAT_DELTA,
  STUDIO.longitude + BBOX_LON_DELTA,
  STUDIO.latitude + BBOX_LAT_DELTA,
]
  .map((n) => n.toFixed(6))
  .join(',');

export const OSM_EMBED_URL =
  `https://www.openstreetmap.org/export/embed.html` +
  `?bbox=${bbox}&layer=mapnik&marker=${STUDIO.latitude},${STUDIO.longitude}`;

export const OSM_PAGE_URL = `https://www.openstreetmap.org/?mlat=${STUDIO.latitude}&mlon=${STUDIO.longitude}#map=17/${STUDIO.latitude}/${STUDIO.longitude}`;

export const COLORS = {
  black: '#000000',
  crimson: '#8B0000',
  gold: '#C5A059',
  grayDeep: '#1A1A1A',
  grayLight: '#A0A0A0',
};

/**
 * TODO: trocar os itens marcados como `placeholder` por fotos reais do
 * trabalho do Bisão em /public/assets. Foto de banco de imagem em portfólio
 * de tatuador derruba a credibilidade da página inteira.
 */
export const PORTFOLIO_DATA: PortfolioItem[] = [
  { id: '1', title: 'Rei Macaco', category: 'Blackwork', image: '/assets/monkey_king.jpg' },
  { id: '2', title: 'Espírito do Tigre', category: 'Blackwork', image: '/assets/tattoo_tiger.jpg' },
  { id: '3', title: 'O Estúdio', category: 'Bastidores', image: '/assets/tattoo_action.jpg' },
  {
    id: '4',
    title: 'Silêncio de Lótus',
    category: 'Fine Line',
    image: 'https://images.unsplash.com/photo-1560707854-fb9a10eeaace?auto=format&fit=crop&q=80&w=1000',
    placeholder: true,
  },
  {
    id: '5',
    title: 'A Grande Onda',
    category: 'Irezumi',
    image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=1000',
    placeholder: true,
  },
];

export const RITUAL_STEPS: RitualStep[] = [
  { number: '01', title: 'O Chamado', description: 'Uma imersão profunda na sua história, mapeando o fluxo da tinta para sua anatomia única.' },
  { number: '02', title: 'A Alquimia', description: 'Desenho sagrado e manual. Refinamos a alma visual da sua peça antes da primeira agulha.' },
  { number: '03', title: 'A Imersão', description: 'Uma sessão meditativa de resiliência. Técnicas tradicionais encontram a precisão visceral.' },
  { number: '04', title: 'O Legado', description: 'A cura é parte da arte. Orientação especializada para preservar a eternidade da sombra.' },
];

/**
 * Os quadros do Bisão, na ordem em que aparecem na fita do carrossel.
 *
 * `accent` é a cor dominante de cada peça — o tom para onde o fundo da seção
 * puxa quando aquela obra ganha o foco.
 *
 * `focal` diz qual faixa da imagem os cards cortados pela metade mantêm.
 * O padrão do componente (50% 26%) foi pensado para retrato de pessoa; aqui
 * cada peça tem o seu, escolhido para que o card cortado ainda mostre o motivo.
 *
 * TODO: os títulos são a minha leitura das imagens. Raijin (aro de tambores),
 * Fujin (saco de vento), Hannya, Daruma, Maneki-neko e Kaminari Ryu (escrito
 * na própria moldura) eu tenho certeza. Os outros o Bisão provavelmente nomeia
 * diferente — vale confirmar com ele.
 */
const FLASH = (slug: string) => `/assets/flash/${slug}.jpg`;

export const FLASH_PIECES: HeroCarouselItem[] = [
  {
    id: 'kaminari-ryu',
    title: 'Kaminari\nRyu',
    image: FLASH('kaminari-ryu'),
    credit: 'BISÃO INK',
    meta: ['IREZUMI', '2024'],
    accent: '#1e3f9e',
    focal: '50% 40%',
  },
  {
    id: 'aguia-serpente',
    title: 'Águia\n& Serpente',
    image: FLASH('aguia-serpente'),
    credit: 'BISÃO INK',
    meta: ['TRADICIONAL'],
    accent: '#e34a5c',
    focal: '50% 45%',
  },
  {
    id: 'deus-do-trovao',
    title: 'Deus do\nTrovão',
    image: FLASH('deus-do-trovao'),
    credit: 'BISÃO INK',
    meta: ['IREZUMI'],
    accent: '#d62828',
    focal: '50% 38%',
  },
  {
    id: 'raijin',
    title: 'Raijin',
    image: FLASH('raijin'),
    credit: 'BISÃO INK',
    meta: ['IREZUMI'],
    accent: '#cf2233',
    focal: '50% 40%',
  },
  {
    id: 'fujin',
    title: 'Fujin',
    image: FLASH('fujin'),
    credit: 'BISÃO INK',
    meta: ['IREZUMI'],
    accent: '#17a89c',
    focal: '50% 40%',
  },
  {
    id: 'hannya',
    title: 'Hannya',
    image: FLASH('hannya'),
    credit: 'BISÃO INK',
    meta: ['IREZUMI'],
    accent: '#f0b400',
    focal: '50% 45%',
  },
  {
    id: 'tigre-relampago',
    title: 'Tigre\n& Relâmpago',
    image: FLASH('tigre-relampago'),
    credit: 'BISÃO INK',
    meta: ['IREZUMI'],
    accent: '#e6a233',
    focal: '50% 55%',
  },
  {
    id: 'koi',
    title: 'Koi',
    image: FLASH('koi'),
    credit: 'BISÃO INK',
    meta: ['IREZUMI'],
    accent: '#1560a8',
    focal: '50% 50%',
  },
  {
    id: 'oiran',
    title: 'Oiran',
    image: FLASH('oiran'),
    credit: 'BISÃO INK',
    meta: ['IREZUMI'],
    accent: '#1f7d7a',
    focal: '50% 35%',
  },
  {
    id: 'samurai-dragao',
    title: 'Samurai\n& Dragão',
    image: FLASH('samurai-dragao'),
    credit: 'BISÃO INK',
    meta: ['IREZUMI'],
    accent: '#12706e',
    focal: '50% 40%',
  },
  {
    id: 'samurai-lava',
    title: 'Samurai\nda Lava',
    image: FLASH('samurai-lava'),
    credit: 'BISÃO INK',
    meta: ['COLAGEM'],
    accent: '#c02818',
    focal: '50% 45%',
  },
  {
    id: 'daruma',
    title: 'Daruma',
    image: FLASH('daruma'),
    credit: 'BISÃO INK',
    meta: ['TRADICIONAL', '2024'],
    accent: '#1f7f8c',
    focal: '50% 45%',
  },
  {
    id: 'maneki-neko',
    title: 'Maneki\nNeko',
    image: FLASH('maneki-neko'),
    credit: 'BISÃO INK',
    meta: ['TRADICIONAL', '2024'],
    accent: '#d61f26',
    focal: '50% 45%',
  },
  {
    id: 'luffy',
    title: 'Luffy',
    image: FLASH('luffy'),
    credit: 'BISÃO INK',
    meta: ['AUTORAL'],
    accent: '#128ba0',
    focal: '50% 35%',
  },
];
