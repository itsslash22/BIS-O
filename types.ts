export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  span?: string;
  /** Foto de banco de imagem, ainda a ser trocada por trabalho real. */
  placeholder?: boolean;
}

export interface RitualStep {
  number: string;
  title: string;
  description: string;
}
