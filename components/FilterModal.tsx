import { GameFilter, PlatformCategory } from "@api/types";
import {
  ActionIcon,
  Button,
  Chip,
  Group,
  Modal,
  Select,
  Space,
  Text,
  Tooltip,
} from "@mantine/core";
import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { allGenres } from "utils/genres";
import {
  allPlatformCategories,
  getPlatformCategoryIcon,
  PLATFORM_CATEGORY_STRINGS,
} from "utils/platform_categories";
import { useMobile } from "utils/useMobile";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameFilter: GameFilter;
  setGameFilter: (_: GameFilter) => void;
}

const FilterModal = ({ isOpen, onClose, gameFilter, setGameFilter }: Props) => {
  const isMobile = useMobile();
  const [tempGameFilter, setTempGameFilter] = useState<GameFilter>(gameFilter);
  const setPlatforms = (platforms: Set<PlatformCategory>) => {
    setTempGameFilter({ ...tempGameFilter, platforms: platforms });
  };

  const togglePlatform = (platform: PlatformCategory) => {
    const platforms = new Set(tempGameFilter.platforms);
    if (platforms.has(platform)) {
      platforms.delete(platform);
    } else {
      platforms.add(platform);
    }
    setPlatforms(platforms);
  };

  const yearData = Array(70)
    .fill(0)
    .map((_, index) => {
      const currentYear = new Date().getFullYear();
      return {
        value: String(currentYear - index),
        label: String(currentYear - index),
      };
    });

  const setYear = (year: string) => {
    setTempGameFilter({
      ...tempGameFilter,
      release_years: new Set(year ? [Number(year)] : []),
    });
  };

  const setGenres = (genres: string[]) => {
    setTempGameFilter({
      ...tempGameFilter,
      genres: new Set(genres),
    });
  };

  return (
    <Modal
      title={
        <Group>
          <FiFilter />
          <Text>Filter</Text>
        </Group>
      }
      opened={isOpen}
      onClose={onClose}
      size={isMobile ? "md" : "lg"}
    >
      <>
        <Text mb={10}>Platforms</Text>
        <Group>
          {allPlatformCategories.map((category) => {
            return (
              <Tooltip
                key={category}
                label={PLATFORM_CATEGORY_STRINGS[category]}
              >
                <ActionIcon
                  variant={
                    tempGameFilter.platforms.has(category) ? "filled" : "light"
                  }
                  color="yellow"
                  onClick={() => togglePlatform(category)}
                >
                  {getPlatformCategoryIcon(category)}
                </ActionIcon>
              </Tooltip>
            );
          })}
        </Group>
        <Space h="md" />
        <Text mb={10}>Release year</Text>
        <Select
          searchable
          data={yearData}
          value={
            String(Array.from(tempGameFilter.release_years.values())[0]) ?? null
          }
          onChange={setYear}
          clearable
        />
        <Space h="md" />
        <Text mb={10}>Genres</Text>
        <Chip.Group
          value={Array.from(tempGameFilter.genres.values())}
          onChange={setGenres}
          multiple
        >
          {allGenres.map((genre) => {
            return (
              <Chip value={genre} key={genre}>
                {genre}
              </Chip>
            );
          })}
        </Chip.Group>
        <Space h="xl" />
        <Button
          onClick={() => {
            setGameFilter(tempGameFilter);
            onClose();
          }}
          fullWidth
        >
          Filter
        </Button>
      </>
    </Modal>
  );
};

export default FilterModal;
