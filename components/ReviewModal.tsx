import { Blockquote, Modal, Spoiler, Title } from "@mantine/core";
import { useMobile } from "utils/useMobile";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  game_name: string;
  rating?: number;
  review: string;
  username: string;
}

const ReviewModal = ({
  isOpen,
  onClose,
  game_name,
  rating,
  review,
  username,
}: Props) => {
  const isMobile = useMobile();
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size={isMobile ? "sm" : "lg"}
      withCloseButton={false}
    >
      <>
        <Title align="center" size={30}>
          {game_name}
        </Title>
        <Blockquote
          cite={`- ${username}${
            rating === null || rating === undefined
              ? ""
              : `, who gave this game ${rating}/10`
          }`}
        >
          <Spoiler maxHeight={250} showLabel="Show more" hideLabel="Hide">
            {review}
          </Spoiler>
        </Blockquote>
      </>
    </Modal>
  );
};

export default ReviewModal;
