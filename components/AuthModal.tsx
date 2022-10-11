import {
  loginApi,
  registerUserApi,
} from "@api/authentication/authentication_api";
import { ErrorType, handleApiRequestError } from "@api/error_handling";
import {
  Anchor,
  Button,
  Group,
  Modal,
  PasswordInput,
  Space,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useAppDispatch } from "@redux/hooks";
import { getSelfUser } from "@redux/slices/User_slice";
import { IconX } from "@tabler/icons";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal = ({ isOpen, onClose }: Props) => {
  const [loading, setLoading] = useState(false);

  const [modalType, setModalType] = useState<"login" | "register">("login");
  const dispatch = useAppDispatch();

  interface FormValues {
    email: string;
    username: string;
    password: string;
  }

  const form = useForm<FormValues>({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },

    validate: {
      username: (value) => {
        if (modalType === "login") {
          return null;
        }

        return value ? null : "Username is required";
      },
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value ? null : "Password is required"),
    },
  });

  const toggleModal = () => {
    setModalType((value) => (value === "login" ? "register" : "login"));
  };

  const handleSubmit = (values: FormValues) => {
    const { email, username, password } = values;

    setLoading(true);
    if (modalType === "login") {
      loginApi({ email, password })
        .then(() => {
          return dispatch(getSelfUser());
        })
        .then(() => {
          handleClose();
        })
        .catch((error) => {
          const apiRequestError = handleApiRequestError(error);

          if (apiRequestError.errorType === ErrorType.INCORRECT_LOGIN_DETAILS) {
            showNotification({
              title: "Invalid Credential",
              message: "Oh no, cannot login with the provided credentials :(",
              icon: <IconX size={18} />,
              color: "red",
            });
          }
        })
        .finally(() => setLoading(false));
    } else if (modalType === "register") {
      // handle register
      registerUserApi({ email, username, password })
        .then(() => {
          return loginApi({ email, password });
        })
        .then(() => {
          return dispatch(getSelfUser());
        })
        .then(() => {
          handleClose();
        })
        .catch((error) => {
          // TODO error handling

          const apiRequestError = handleApiRequestError(error);

          if (apiRequestError.errorType === ErrorType.EMAIL_IN_USE) {
            showNotification({
              title: "Email has been taken by someone else",
              message: "Oh no, the email has already been taken :(",
              icon: <IconX size={18} />,
              color: "red",
            });
          } else if (apiRequestError.errorType === ErrorType.USERNAME_IN_USE) {
            showNotification({
              title: "Username has been taken by someone else",
              message: "Oh no, the username has already been taken :(",
              icon: <IconX size={18} />,
              color: "red",
            });
          }
          console.log(
            handleApiRequestError(error).message,
            handleApiRequestError(error).errorType
          );
        })
        .finally(() => setLoading(false));
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal centered opened={isOpen} onClose={handleClose} title="Welcome Back!">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {modalType === "register" && (
            <TextInput
              withAsterisk
              label="Username"
              {...form.getInputProps("username")}
            />
          )}
          <TextInput
            withAsterisk
            label="Email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            withAsterisk
            label="Password"
            {...form.getInputProps("password")}
          />
          <Space h="lg" />
          <Group position="apart">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={toggleModal}
              size="xs"
            >
              {modalType === "login"
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Anchor>
            <Button type="submit" loading={loading}>
              {modalType === "login" ? "Login" : "Register"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AuthModal;
