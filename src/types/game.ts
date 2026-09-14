export type FlavorId = 'vanilla' | 'strawberry' | 'chocolate' | 'mint' | 'mango' | 'blueberry';

export type ToppingId = 'cherry' | 'sprinkles' | 'chocolate_sauce' | 'strawberry_syrup' | 'whipped_cream';

export type ContainerType = 'waffle_cone' | 'cup' | 'milkshake_glass';

export type HairStyle =
  | 'bob_bangs'
  | 'ponytail'
  | 'curly_short'
  | 'side_part'
  | 'twin_tails'
  | 'afro'
  | 'braids'
  | 'buzz_cut'
  | 'wavy_long'
  | 'pixie_cut'
  | 'topknot_bun'
  | 'curly_fade';

export type BodyType = 'slim' | 'average' | 'athletic' | 'sturdy' | 'plus';
export type HeightType = 'short' | 'average' | 'tall';

export type ClothingStyle =
  | 'crewneck_tshirt'
  | 'hoodie'
  | 'striped_tee'
  | 'button_shirt'
  | 'tank_top'
  | 'denim_jacket'
  | 'sweater_vest';

export type FacialHair = 'none' | 'stubble' | 'short_beard' | 'mustache';

export type Accessory =
  | 'none'
  | 'pink_bow'
  | 'straw_hat'
  | 'flower_clip'
  | 'sunglasses_head'
  | 'round_wire_glasses'
  | 'thick_rim_glasses'
  | 'beanie'
  | 'bucket_hat'
  | 'chef_cap';

export interface CustomerAppearance {
  skinTone: string;
  hairColor: string;
  hairStyle: HairStyle;
  eyeColor: string;
  shirtColor: string;
  clothingStyle?: ClothingStyle;
  bodyType?: BodyType;
  height?: HeightType;
  facialHair?: FacialHair;
  secondaryClothingColor?: string;
  accessory: Accessory;
  gender: 'female' | 'male';
}

export interface FlavorInfo {
  id: FlavorId;
  name: string;
  color: string;
  darkColor: string;
  description: string;
}

export interface ToppingInfo {
  id: ToppingId;
  name: string;
  icon: string;
  color: string;
}

export interface IceCreamOrder {
  id: string;
  customerName: string;
  appearance: CustomerAppearance;
  slotIndex: number; // 0 (left), 1 (center), 2 (right)
  isMilkshake: boolean;
  container: ContainerType;
  scoops: FlavorId[]; // Bottom to top
  toppings: ToppingId[];
  milkshakeFlavor?: FlavorId;
  totalPatienceSeconds: number;
  remainingPatienceSeconds: number;
  maxHearts: number;
  currentHearts: number;
}

export interface BuiltItem {
  container: ContainerType;
  scoops: FlavorId[];
  toppings: ToppingId[];
  isMilkshake: boolean;
  milkshakeFlavor?: FlavorId;
  isBlended?: boolean;
}

export interface ScoreBreakdown {
  accuracyScore: number; // 0 - 100
  speedBonus: number;
  comboBonus: number;
  totalScore: number;
  tipEarned: number;
  feedbackText: string;
  isPerfect: boolean;
}

export interface GameStats {
  day: number;
  score: number;
  coins: number;
  combo: number;
  maxCombo: number;
  customersServed: number;
  perfectOrders: number;
  angryCustomers: number;
  timeLeft: number; // seconds in shift
  isShiftActive: boolean;
  isDayComplete: boolean;
  isGameOver: boolean;
}
