import {
  Modal,
  Select,
  MultiSelect,
  Button,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Game, GameEntry, GameEntryStatus } from "@api/types";
import { useEffect, useState } from "react";
import { getGameByIdApi } from "@api/games_api";
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { updateGameEntry } from "@redux/slices/GameEntry_slice";
import { showSuccessNotification } from "utils/notifications";
import { useAppDispatch } from "@redux/hooks";

interface FormValues {
  status: string;
  rating: string;
  platforms: string[];
}

type Props = {
  opened: boolean;
  onClose: () => void;
  gameEntry: GameEntry;
};

const GameEntryEditModal = (props: Props) => {
  const { opened, onClose, gameEntry } = props;

  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoading(true);

    getGameByIdApi(gameEntry.game_id)
      .then((game) => {
        setGame(game);
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [gameEntry.game_id]);

  const form = useForm<FormValues>({
    initialValues: {
      status: String(gameEntry.status),
      rating: String(gameEntry.rating),
      platforms: gameEntry.platforms || [],
    },

    validate: {
      status: (value) => (value ? null : "Status is required"),
    },
  });

  const handleSubmit = (values: FormValues) => {
    const newGameEntry: GameEntry = {
      ...gameEntry,
      platforms: values.platforms,
      status: Number(values.status),
      rating: Number(values.rating),
    };

    dispatch(updateGameEntry(newGameEntry))
      .then(() => {
        onClose();
        showSuccessNotification({
          title: "Entry updated",
          message: gameEntry.game_name,
        });
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });

    // updateGameEntryApi(newGameEntry)
    //   .then(() => {
    //     onClose();
    //     showSuccessNotification({
    //       title: "Entry updated",
    //       message: gameEntry.game_name,
    //     });

    //     dispatch(getGameEntries({ user_id: gameEntry.user_id }));
    //   })
    //   .catch((error) => {
    //     showApiRequestErrorNotification(handleApiRequestError(error));
    //   });
  };

  return (
    <Modal opened={opened} onClose={onClose} title={gameEntry.game_name}>
      <LoadingOverlay visible={isLoading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          label="Status"
          placeholder="Pick one"
          data={[
            {
              value: String(GameEntryStatus.WISHLIST),
              label: "Wishlist",
            },
            { value: String(GameEntryStatus.BACKLOG), label: "Backlog" },
            { value: String(GameEntryStatus.PLAYING), label: "Playing" },
            {
              value: String(GameEntryStatus.COMPLETED),
              label: "Completed",
            },
            { value: String(GameEntryStatus.DROPPED), label: "Dropped" },
          ]}
          {...form.getInputProps("status")}
        />
        <Select
          label="Rating"
          placeholder="Out of 10"
          data={Array(11)
            .fill(0)
            .map((_, index) => `${index}`)}
          {...form.getInputProps("rating")}
        />
        <MultiSelect
          label="Platform"
          placeholder="Pick any"
          data={game?.platforms || []}
          {...form.getInputProps("platforms")}
        />

        <Group position="right">
          <Button type="submit" mt="md">
            Update
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default GameEntryEditModal;
