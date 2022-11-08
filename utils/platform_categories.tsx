import { Platform, PlatformCategory } from "@api/types";
import { IoGameControllerOutline } from "react-icons/io5";
import { MdComputer } from "react-icons/md";
import {
  SiAndroid,
  SiIos,
  SiNintendo,
  SiNintendo3Ds,
  SiNintendoswitch,
  SiPlaystation,
  SiSega,
  SiXbox,
} from "react-icons/si";

export const PLATFORM_CATEGORY_STRINGS: Record<PlatformCategory, string> = {
  [PlatformCategory.OTHERS]: "Others",
  [PlatformCategory.XBOX]: "Xbox",
  [PlatformCategory.PLAYSTATION]: "Playstation",
  [PlatformCategory.COMPUTER]: "PC",
  [PlatformCategory.IOS]: "iOS",
  [PlatformCategory.ANDROID]: "Android",
  [PlatformCategory.NINTENDO_SWITCH]: "Nintendo Switch",
  [PlatformCategory.NINTENDO_HANDHELD]: "Nintendo Handheld",
  [PlatformCategory.NINTENDO_OTHER]: "Nintendo",
  [PlatformCategory.SEGA]: "Sega",
};

export const PLATFORM_CATEGORY_MAPPINGS: Record<
  PlatformCategory,
  Set<Platform>
> = {
  [PlatformCategory.OTHERS]: new Set(),
  [PlatformCategory.XBOX]: new Set([
    "Xbox",
    "Xbox 360",
    "Xbox Live Arcade",
    "Xbox One",
    "Xbox Series X|S",
  ]),
  [PlatformCategory.PLAYSTATION]: new Set([
    "PlayStation",
    "PlayStation 2",
    "PlayStation 3",
    "PlayStation 4",
    "PlayStation 5",
    "PlayStation Portable",
    "PlayStation Vita",
    "PlayStation VR",
    "PlayStation VR2",
  ]),
  [PlatformCategory.COMPUTER]: new Set([
    "PC (Microsoft Windows)",
    "Mac",
    "Linux",
    "Web browser",
  ]),
  [PlatformCategory.IOS]: new Set(["iOS"]),
  [PlatformCategory.ANDROID]: new Set(["Android"]),
  [PlatformCategory.NINTENDO_SWITCH]: new Set(["Nintendo Switch"]),
  [PlatformCategory.NINTENDO_HANDHELD]: new Set([
    "Nintendo DSi",
    "Nintendo 3DS",
    "Nintendo DS",
    "New Nintendo 3DS",
    "Game Boy Advance",
    "Game Boy Color",
    "Game Boy",
  ]),
  [PlatformCategory.NINTENDO_OTHER]: new Set([
    "Virtual Console (Nintendo)",
    "Nintendo 64",
    "Nintendo Entertainment System",
    "Nintendo PlayStation",
    "Nintendo GameCube",
    "Super Nintendo Entertainment System",
    "Nintendo 64DD",
    "Wii",
    "Wii U",
    "Virtual Boy",
    "Super Famicom",
  ]),
  [PlatformCategory.SEGA]: new Set([
    "Sega Pico",
    "Sega Game Gear",
    "Sega CD",
    "Sega 32X",
    "Sega Mega Drive/Genesis",
    "Sega Master System/Mark III",
    "Sega Saturn",
  ]),
};

export const allPlatformCategories: PlatformCategory[] = [
  PlatformCategory.OTHERS,
  PlatformCategory.XBOX,
  PlatformCategory.PLAYSTATION,
  PlatformCategory.COMPUTER,
  PlatformCategory.IOS,
  PlatformCategory.ANDROID,
  PlatformCategory.NINTENDO_SWITCH,
  PlatformCategory.NINTENDO_HANDHELD,
  PlatformCategory.NINTENDO_OTHER,
  PlatformCategory.SEGA,
];

export function categorizePlatforms(
  platforms: Platform[]
): Record<PlatformCategory, Platform[]> {
  let platformCopy = Object.create(platforms);
  const platformsCategorised: Record<PlatformCategory, Platform[]> = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  };
  const numOfPlatformCategories = allPlatformCategories.length;
  for (let i = 1; i < numOfPlatformCategories; i++) {
    const platformCategory = i as PlatformCategory;
    const platformFilter = (platform: Platform) =>
      PLATFORM_CATEGORY_MAPPINGS[platformCategory].has(platform);
    platformsCategorised[platformCategory] = platforms.filter(platformFilter);
    platformCopy = platformCopy.filter((p: Platform) => !platformFilter(p));
  }
  platformsCategorised[0] = platformCopy;
  return platformsCategorised;
}

const PLATFORM_CATEGORY_ICONS: Record<PlatformCategory, JSX.Element> = {
  [PlatformCategory.OTHERS]: IoGameControllerOutline({ color: "white" }),
  [PlatformCategory.XBOX]: SiXbox({}),
  [PlatformCategory.PLAYSTATION]: SiPlaystation({}),
  [PlatformCategory.COMPUTER]: MdComputer({}),
  [PlatformCategory.IOS]: SiIos({}),
  [PlatformCategory.ANDROID]: SiAndroid({}),
  [PlatformCategory.NINTENDO_SWITCH]: SiNintendoswitch({}),
  [PlatformCategory.NINTENDO_HANDHELD]: SiNintendo3Ds({}),
  [PlatformCategory.NINTENDO_OTHER]: SiNintendo({}),
  [PlatformCategory.SEGA]: SiSega({}),
};

export function getPlatformCategoryIcon(
  platformCategory: PlatformCategory
): JSX.Element {
  return PLATFORM_CATEGORY_ICONS[platformCategory];
}
