export interface ResourceCard {
  id: string;
  time: number;
  homeBoardId: string;
  skill: 'HEART' | 'DIAMOND' | 'SPADE';
  name: string;
}
