import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { getGameByIdApi } from "@api/games_api";
import { Game, GameEntry } from "@api/types";
import {
  Button,
  Chip,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { useAppDispatch } from "@redux/hooks";
import {
  createGameEntry,
  deleteGameEntry,
  updateGameEntry,
} from "@redux/slices/GameEntry_slice";
import { useEffect, useState } from "react";
import { showSuccessNotification } from "utils/notifications";
import { STATUS_DATA } from "utils/status";

interface FormValues {
  status: string;
  rating: string;
  platforms: string[];
  review: string;
}

type Props = {
  opened: boolean;
  onClose: () => void;
  gameEntry: GameEntry;
  isAddingGame: boolean;
};

const GameEntryEditModal = (props: Props) => {
  const { opened, onClose, gameEntry, isAddingGame } = props;

  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useMantineTheme();
  const isScreenSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (opened) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const form = useForm<FormValues>({
    initialValues: {
      status: String(gameEntry.status),
      rating: String(gameEntry.rating),
      platforms: gameEntry.platforms || [],
      review: String(gameEntry.review),
    },

    validate: {
      status: (value) =>
        value && value !== "undefined" ? null : "Status is required",
    },
  });

  const handleSubmit = (values: FormValues) => {
    const newGameEntry: GameEntry = {
      ...gameEntry,
      platforms: values.platforms,
      status: Number(values.status),
      rating: Number(values.rating),
      review: values.review,
    };

    if (isAddingGame) {
      dispatch(createGameEntry(newGameEntry))
        .unwrap()
        .then(() => {
          onClose();
          showSuccessNotification({
            title: "Entry added",
            message: gameEntry.game_name,
          });
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        });
    } else {
      dispatch(updateGameEntry(newGameEntry))
        .unwrap()
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
    }
  };

  const handleDeleteClick = () => {
    openConfirmModal({
      title: "Delete entry",
      children: (
        <Text size="sm">Are you sure you want to delete this entry?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: deleteCurrentGameEntry,
    });
    onClose();
  };

  const deleteCurrentGameEntry = () => {
    if (!gameEntry) {
      return;
    }
    dispatch(deleteGameEntry(gameEntry.id))
      .unwrap()
      .then(() => {
        form.reset();
        showSuccessNotification({
          title: "Game deleted from display case",
          message: `${gameEntry.game_name}`,
        });
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={gameEntry.game_name}
      size={isScreenSmall ? "sm" : "lg"}
    >
      <LoadingOverlay visible={isLoading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          label="Status"
          placeholder="Pick one"
          data={STATUS_DATA}
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
        <Textarea
          label="Review"
          placeholder="Write a Review"
          autosize
          minRows={2}
          maxRows={6}
          {...form.getInputProps("review")}
        />
        <Text mt={10} size="sm">
          {game?.platforms.length === 1 ? "Platform" : "Platforms"}
        </Text>
        <Chip.Group {...form.getInputProps("platforms")} mt={10} multiple>
          {game?.platforms.map((platform) => {
            return (
              <Chip value={platform} key={platform}>
                {platform}
              </Chip>
            );
          })}
        </Chip.Group>

        <Group position="right" mt="md">
          {!isAddingGame && (
            <Button color="red" onClick={handleDeleteClick}>
              Delete
            </Button>
          )}
          <Button type="submit">{isAddingGame ? "Add" : "Update"}</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default GameEntryEditModal;
