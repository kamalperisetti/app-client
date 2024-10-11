export interface ResourceCard {
  id: string;
  time: number;
  homeBoardId: string;
  skill: 'HEART' | 'DIAMOND' | 'SPADE';
  name: string;
}

export type demand = {
  time: number;
  skill: string;
};

export type projectType = {
  id: string;
  name: string;
  initialStartTime: number;
  initialFinishTime: number;
  demands: demand[];
  projectStartTime: number;
};

type Owner = {
  id: string;
  name: string;
  role: string;
  scores: number[];
};

// export type Card = {
//   homeBoardId: string;
//   id: string;
//   name: string;
//   skill: string;
//   time: number;
// };

export type ProjectPlane = {
  id: string;
  owner: Owner;
  project: projectType;
  projectStartTime: number;
  cards: ResourceCard[];
};
