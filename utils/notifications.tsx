import { showNotification } from "@mantine/notifications";
import { TbCheck, TbX } from "react-icons/tb";

interface NotificationProps {
  title: string;
  message: string;
}

export const showErrorNotification = ({
  title,
  message,
}: NotificationProps) => {
  showNotification({
    title: title,
    message: message,
    icon: <TbX size={18} />,
    color: "red",
  });
};

export const showSuccessNotification = ({
  title,
  message,
}: NotificationProps) => {
  showNotification({
    title: title,
    message: message,
    icon: <TbCheck size={18} />,
    color: "green",
  });
};
