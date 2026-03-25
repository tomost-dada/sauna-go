export type User = {
  id: string;
  nickname: string;
  email: string;
  level: number;
  xp: number;
  title: string;
  profileImgUrl: string;
  createdAt: string;
};

export type Sauna = {
  id: string;
  name: string;
  address: string;
  region: 'seoul' | 'gyeonggi' | 'jeju';
  category: 'finnish' | 'bulgama' | 'hotel' | 'jjimjilbang';
  locationLat: number;
  locationLng: number;
  description: string;
  imageUrl: string;
  totalConqueredCount: number;
};

export type CheckIn = {
  id: string;
  userId: string;
  saunaId: string;
  ratingHotTub: number;
  ratingColdTub: number;
  ratingSauna: number;
  ratingCleanliness: number;
  ratingFacility: number;
  ratingOverall: number;
  oneLineReview: string;
  privateNote: string;
  visitedAt: string;
  createdAt: string;
};

export type CollectionItemType = 'wooden_bucket' | 'scented_oil' | 'luxury_robe' | 'sauna_hat' | 'towel_set' | 'thermometer' | 'birch_whisk' | 'sand_timer' | 'steam_stone' | 'ice_bucket';

export type CollectionItemMeta = {
  itemType: CollectionItemType;
  displayName: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
};

export type Collection = {
  id: string;
  userId: string;
  itemType: CollectionItemType;
  unlockedAt: string | null;
};

export type SaunaReview = {
  nickname: string;
  title: string;
  ratingOverall: number;
  oneLineReview: string;
  visitedAt: string;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  xpReward: number;
};

export type CommunityPost = {
  id: string;
  hostId: string;
  hostNickname: string;
  hostTitle: string;
  saunaId: string;
  saunaName: string;
  region: Sauna['region'];
  category: Sauna['category'];
  maxSpots: number;
  currentSpots: number;
  meetDate: string;
  description: string;
  createdAt: string;
};
