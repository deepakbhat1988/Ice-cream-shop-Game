import {
  Accessory,
  BodyType,
  ClothingStyle,
  CustomerAppearance,
  FacialHair,
  FlavorId,
  FlavorInfo,
  HairStyle,
  HeightType,
  IceCreamOrder,
  ScoreBreakdown,
  ToppingId,
  ToppingInfo,
  BuiltItem,
} from '../types/game';

export const FLAVORS: (FlavorInfo & { icon: string; realFruitDetail: string })[] = [
  { id: 'strawberry', name: 'Fresh Real Strawberry', icon: '🍓', color: '#FB7185', darkColor: '#BE123C', description: 'Fresh strawberry puree with real diced strawberry chunks & seeds', realFruitDetail: 'Real Strawberry Chunks & Seeds' },
  { id: 'vanilla', name: 'Madagascar Vanilla Bean', icon: '🍦', color: '#FEF3C7', darkColor: '#F59E0B', description: 'Sweet custard cream with real black vanilla bean specks', realFruitDetail: 'Ground Vanilla Bean Specks' },
  { id: 'chocolate', name: 'Belgian Chocolate Fudge', icon: '🍫', color: '#3E1F0F', darkColor: '#180B04', description: 'Dark Dutch cocoa with rich chocolate fudge & dark chocolate chips', realFruitDetail: 'Dark Chocolate Chunks & Fudge' },
  { id: 'mint', name: 'Fresh Mint Choco Chip', icon: '🌿', color: '#A7F3D0', darkColor: '#059669', description: 'Cool spearmint leaf cream with dark chocolate flake shavings', realFruitDetail: 'Mint Leaves & Choco Flakes' },
  { id: 'mango', name: 'Alphonso Golden Mango', icon: '🥭', color: '#FBBF24', darkColor: '#EA580C', description: 'Sun-ripened Alphonso mango with luscious fruit puree swirl', realFruitDetail: 'Juicy Mango Puree & Chunks' },
  { id: 'blueberry', name: 'Wild Mountain Blueberry', icon: '🫐', color: '#C084FC', darkColor: '#6B21A8', description: 'Lush wild blueberries with deep violet berry fruit compote', realFruitDetail: 'Whole Wild Blueberries' },
];

export const TOPPINGS: ToppingInfo[] = [
  { id: 'cherry', name: 'Sweet Cherry', icon: '🍒', color: '#EF4444' },
  { id: 'sprinkles', name: 'Rainbow Sprinkles', icon: '✨', color: '#EC4899' },
  { id: 'chocolate_sauce', name: 'Choco Drizzle', icon: '🍫', color: '#78350F' },
  { id: 'strawberry_syrup', name: 'Berry Syrup', icon: '🍓', color: '#F43F5E' },
  { id: 'whipped_cream', name: 'Whipped Cloud', icon: '☁️', color: '#F8FAFC' },
];

const HUMAN_PROFILES: Array<{
  name: string;
  gender: 'female' | 'male';
  skinTone: string;
  hairColor: string;
  hairStyle: HairStyle;
  eyeColor: string;
  shirtColor: string;
  secondaryClothingColor?: string;
  clothingStyle: ClothingStyle;
  bodyType: BodyType;
  height: HeightType;
  facialHair?: FacialHair;
  accessory: Accessory;
}> = [
  {
    name: 'Mia',
    gender: 'female',
    skinTone: '#FFE0BD',
    hairColor: '#D97706', // Sun blonde
    hairStyle: 'bob_bangs',
    eyeColor: '#2563EB', // Sapphire blue
    shirtColor: '#38BDF8', // Sky blue
    clothingStyle: 'striped_tee',
    bodyType: 'slim',
    height: 'average',
    accessory: 'round_wire_glasses',
  },
  {
    name: 'Marcus',
    gender: 'male',
    skinTone: '#452B1F', // Deep rich ebony
    hairColor: '#0F172A', // Jet black
    hairStyle: 'curly_fade',
    eyeColor: '#451A03', // Deep cocoa
    shirtColor: '#F59E0B', // Warm amber hoodie
    secondaryClothingColor: '#D97706',
    clothingStyle: 'hoodie',
    bodyType: 'athletic',
    height: 'tall',
    facialHair: 'short_beard',
    accessory: 'thick_rim_glasses',
  },
  {
    name: 'Chloe',
    gender: 'female',
    skinTone: '#FAD2B0',
    hairColor: '#451A03', // Rich espresso
    hairStyle: 'ponytail',
    eyeColor: '#059669', // Emerald green
    shirtColor: '#FB7185', // Rose pink tee
    clothingStyle: 'crewneck_tshirt',
    bodyType: 'average',
    height: 'average',
    accessory: 'pink_bow',
  },
  {
    name: 'Lucas',
    gender: 'male',
    skinTone: '#E8BEAC',
    hairColor: '#78350F', // Chestnut brown
    hairStyle: 'side_part',
    eyeColor: '#1E293B', // Deep dark
    shirtColor: '#34D399', // Mint green button-down
    clothingStyle: 'button_shirt',
    bodyType: 'average',
    height: 'tall',
    facialHair: 'stubble',
    accessory: 'sunglasses_head',
  },
  {
    name: 'Aaliyah',
    gender: 'female',
    skinTone: '#6B4423', // Rich deep bronze
    hairColor: '#18181B', // Black
    hairStyle: 'afro',
    eyeColor: '#78350F', // Warm brown
    shirtColor: '#EC4899', // Vibrant magenta tank
    clothingStyle: 'tank_top',
    bodyType: 'athletic',
    height: 'tall',
    accessory: 'round_wire_glasses',
  },
  {
    name: 'Zoe',
    gender: 'female',
    skinTone: '#C68642', // Golden tan
    hairColor: '#171717', // Jet black
    hairStyle: 'twin_tails',
    eyeColor: '#D97706', // Warm amber
    shirtColor: '#FBBF24', // Sunny yellow
    clothingStyle: 'denim_jacket',
    secondaryClothingColor: '#1E40AF',
    bodyType: 'slim',
    height: 'short',
    accessory: 'flower_clip',
  },
  {
    name: 'Devon',
    gender: 'male',
    skinTone: '#8D5524', // Warm umber
    hairColor: '#1C1917',
    hairStyle: 'braids',
    eyeColor: '#3B82F6', // Hazel blue
    shirtColor: '#10B981', // Forest emerald hoodie
    secondaryClothingColor: '#047857',
    clothingStyle: 'hoodie',
    bodyType: 'sturdy',
    height: 'average',
    facialHair: 'short_beard',
    accessory: 'beanie',
  },
  {
    name: 'Sofia',
    gender: 'female',
    skinTone: '#F3C59D', // Warm peach
    hairColor: '#92400E', // Auburn chestnut
    hairStyle: 'wavy_long',
    eyeColor: '#10B981', // Forest green
    shirtColor: '#8B5CF6', // Lavender sweater vest
    secondaryClothingColor: '#F8FAFC',
    clothingStyle: 'sweater_vest',
    bodyType: 'plus',
    height: 'average',
    accessory: 'straw_hat',
  },
  {
    name: 'Ethan',
    gender: 'male',
    skinTone: '#FFDFBF',
    hairColor: '#B45309', // Caramel auburn
    hairStyle: 'curly_short',
    eyeColor: '#3B82F6', // Ocean blue
    shirtColor: '#A78BFA', // Soft lilac shirt
    clothingStyle: 'button_shirt',
    bodyType: 'slim',
    height: 'average',
    facialHair: 'none',
    accessory: 'none',
  },
  {
    name: 'Maya',
    gender: 'female',
    skinTone: '#8D5524', // Rich bronze
    hairColor: '#18181B', // Midnight black
    hairStyle: 'braids',
    eyeColor: '#78350F', // Cocoa brown
    shirtColor: '#F43F5E', // Coral pink
    clothingStyle: 'crewneck_tshirt',
    bodyType: 'sturdy',
    height: 'tall',
    accessory: 'bucket_hat',
  },
  {
    name: 'Kai',
    gender: 'male',
    skinTone: '#F5D0A9', // Golden olive
    hairColor: '#1E293B', // Raven black
    hairStyle: 'topknot_bun',
    eyeColor: '#475569', // Slate grey
    shirtColor: '#6366F1', // Indigo streetwear tee
    clothingStyle: 'striped_tee',
    bodyType: 'athletic',
    height: 'tall',
    facialHair: 'stubble',
    accessory: 'round_wire_glasses',
  },
  {
    name: 'Hana',
    gender: 'female',
    skinTone: '#FFE8D6', // Porcelain peach
    hairColor: '#451A03', // Dark espresso
    hairStyle: 'pixie_cut',
    eyeColor: '#D97706', // Honey amber
    shirtColor: '#14B8A6', // Teal green sweater vest
    clothingStyle: 'sweater_vest',
    bodyType: 'slim',
    height: 'short',
    accessory: 'thick_rim_glasses',
  },
  {
    name: 'Leo',
    gender: 'male',
    skinTone: '#FEE2E2',
    hairColor: '#CA8A04', // Honey golden
    hairStyle: 'buzz_cut',
    eyeColor: '#10B981', // Jade green
    shirtColor: '#60A5FA', // Marine blue
    clothingStyle: 'denim_jacket',
    secondaryClothingColor: '#2563EB',
    bodyType: 'plus',
    height: 'average',
    facialHair: 'mustache',
    accessory: 'beanie',
  },
  {
    name: 'Emma',
    gender: 'female',
    skinTone: '#FED7AA',
    hairColor: '#F472B6', // Pastel strawberry pink
    hairStyle: 'wavy_long',
    eyeColor: '#8B5CF6', // Lavender violet
    shirtColor: '#FDE047', // Lemon pastel
    clothingStyle: 'hoodie',
    bodyType: 'plus',
    height: 'short',
    accessory: 'flower_clip',
  },
  {
    name: 'Oliver',
    gender: 'male',
    skinTone: '#E2B89B', // Olive tan
    hairColor: '#713F12', // Warm walnut
    hairStyle: 'side_part',
    eyeColor: '#15803D', // Olive emerald
    shirtColor: '#DC2626', // Crimson cafe button-down
    clothingStyle: 'button_shirt',
    bodyType: 'sturdy',
    height: 'tall',
    facialHair: 'short_beard',
    accessory: 'thick_rim_glasses',
  },
];

export function generateOrder(day: number, customerIndex: number, slotIndex = 0): IceCreamOrder {
  const profileTemplate = HUMAN_PROFILES[(customerIndex + Math.floor(Math.random() * 3)) % HUMAN_PROFILES.length];
  
  const appearance: CustomerAppearance = {
    skinTone: profileTemplate.skinTone,
    hairColor: profileTemplate.hairColor,
    hairStyle: profileTemplate.hairStyle,
    eyeColor: profileTemplate.eyeColor,
    shirtColor: profileTemplate.shirtColor,
    secondaryClothingColor: profileTemplate.secondaryClothingColor,
    clothingStyle: profileTemplate.clothingStyle,
    bodyType: profileTemplate.bodyType,
    height: profileTemplate.height,
    facialHair: profileTemplate.facialHair,
    accessory: profileTemplate.accessory,
    gender: profileTemplate.gender,
  };

  // Day 1: 1-2 scoops, simple toppings
  // Day 2+: 2-3 scoops, milkshakes unlocked, multiple toppings
  const allowMilkshake = day >= 2 && Math.random() > 0.55;
  const isMilkshake = allowMilkshake;

  let container: IceCreamOrder['container'] = 'waffle_cone';
  let scoops: FlavorId[] = [];
  let toppings: ToppingId[] = [];
  let milkshakeFlavor: FlavorId | undefined = undefined;

  if (isMilkshake) {
    container = 'milkshake_glass';
    const flavorKeys: FlavorId[] = ['strawberry', 'chocolate', 'vanilla', 'mango'];
    milkshakeFlavor = flavorKeys[Math.floor(Math.random() * flavorKeys.length)];
    // Milkshakes usually have whipped cream + topping
    toppings.push('whipped_cream');
    if (Math.random() > 0.4) {
      toppings.push(Math.random() > 0.5 ? 'cherry' : 'sprinkles');
    }
  } else {
    container = Math.random() > 0.35 ? 'waffle_cone' : 'cup';
    // Scoop count increases with day
    const maxScoops = day === 1 ? (Math.random() > 0.6 ? 2 : 1) : Math.min(3, Math.floor(Math.random() * 2) + 2);
    const availableFlavors = FLAVORS.map(f => f.id);

    for (let i = 0; i < maxScoops; i++) {
      const flavor = availableFlavors[Math.floor(Math.random() * availableFlavors.length)];
      scoops.push(flavor);
    }

    // Add 1 to 2 toppings
    const toppingCount = Math.floor(Math.random() * (day > 1 ? 3 : 2));
    const allToppings = TOPPINGS.map(t => t.id);
    const shuffledToppings = [...allToppings].sort(() => Math.random() - 0.5);

    for (let i = 0; i < toppingCount; i++) {
      toppings.push(shuffledToppings[i]);
    }
  }

  // Base patience in seconds: 35s to 45s depending on day
  const basePatience = Math.max(26, 42 - day * 2);

  return {
    id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    customerName: profileTemplate.name,
    appearance,
    slotIndex,
    isMilkshake,
    container,
    scoops,
    toppings,
    milkshakeFlavor,
    totalPatienceSeconds: basePatience,
    remainingPatienceSeconds: basePatience,
    maxHearts: 5,
    currentHearts: 5,
  };
}

export function evaluateOrder(order: IceCreamOrder, built: BuiltItem, combo: number): ScoreBreakdown {
  let accuracyPoints = 0;
  let totalPossible = 0;

  // 1. Check Container / Type match
  totalPossible += 25;
  if (order.container === built.container && order.isMilkshake === built.isMilkshake) {
    accuracyPoints += 25;
  }

  // 2. Scoop/Flavor Match
  if (order.isMilkshake) {
    totalPossible += 35;
    if (built.isBlended && order.milkshakeFlavor === built.milkshakeFlavor) {
      accuracyPoints += 35;
    } else if (order.milkshakeFlavor === built.milkshakeFlavor) {
      accuracyPoints += 15; // Forgot to blend!
    }
  } else {
    // Check scoops: order and count
    totalPossible += 45;
    const requiredScoops = order.scoops;
    const builtScoops = built.scoops;

    if (requiredScoops.length === builtScoops.length) {
      let matchedCount = 0;
      for (let i = 0; i < requiredScoops.length; i++) {
        if (requiredScoops[i] === builtScoops[i]) {
          matchedCount++;
        }
      }
      // Exact order match bonus
      accuracyPoints += Math.round((matchedCount / requiredScoops.length) * 45);
    } else {
      // Partial match
      let matches = 0;
      const copyBuilt = [...builtScoops];
      for (const s of requiredScoops) {
        const idx = copyBuilt.indexOf(s);
        if (idx !== -1) {
          matches++;
          copyBuilt.splice(idx, 1);
        }
      }
      accuracyPoints += Math.max(0, Math.round((matches / (requiredScoops.length + 1)) * 25));
    }
  }

  // 3. Topping Match
  totalPossible += 30;
  const reqToppings = new Set(order.toppings);
  const builtToppings = new Set(built.toppings);

  let toppingMatches = 0;
  for (const t of reqToppings) {
    if (builtToppings.has(t)) toppingMatches++;
  }
  // Penalize extra wrong toppings slightly
  let extraCount = 0;
  for (const t of builtToppings) {
    if (!reqToppings.has(t)) extraCount++;
  }

  if (order.toppings.length === 0) {
    if (built.toppings.length === 0) {
      accuracyPoints += 30;
    } else {
      accuracyPoints += Math.max(0, 30 - extraCount * 10);
    }
  } else {
    const fraction = (toppingMatches - extraCount * 0.5) / order.toppings.length;
    accuracyPoints += Math.max(0, Math.round(fraction * 30));
  }

  const accuracyScore = Math.min(100, Math.max(0, Math.round((accuracyPoints / totalPossible) * 100)));

  // Speed Bonus based on hearts remaining
  const heartRatio = order.currentHearts / order.maxHearts;
  const speedBonus = Math.round(heartRatio * 50);

  // Combo multiplier
  const comboMultiplier = 1 + combo * 0.25;
  const baseReward = accuracyScore * 2;
  const totalScore = Math.round((baseReward + speedBonus) * comboMultiplier);

  // Tips
  let tipEarned = 0;
  if (accuracyScore >= 95) {
    tipEarned = 3 + Math.floor(heartRatio * 4);
  } else if (accuracyScore >= 75) {
    tipEarned = 1 + Math.floor(heartRatio * 2);
  }

  const isPerfect = accuracyScore >= 95 && built.scoops.length === order.scoops.length;

  let feedbackText = 'Sweet!';
  if (isPerfect) feedbackText = '🍓 Kawaii Perfection! ✨';
  else if (accuracyScore >= 80) feedbackText = 'Super Yummy! 💖';
  else if (accuracyScore >= 60) feedbackText = 'Good Effort! 🍦';
  else feedbackText = 'Hmm, not quite right... 😅';

  return {
    accuracyScore,
    speedBonus,
    comboBonus: Math.round(totalScore - (baseReward + speedBonus)),
    totalScore,
    tipEarned,
    feedbackText,
    isPerfect,
  };
}
