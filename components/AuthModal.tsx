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
import { useState } from "react";

type Props = {
  opened: boolean;
  onClose: () => void;
};

const AuthModal = (props: Props) => {
  const { opened, onClose } = props;
  const [modalType, setModalType] = useState<"login" | "register">("login");

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

    console.log(values);

    if (modalType === "login") {
      // handle login
    } else if (modalType === "register") {
      // handle register
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal centered opened={opened} onClose={handleClose} title="Welcome Back!">
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
            <Button type="submit">
              {modalType === "login" ? "Login" : "Register"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AuthModal;
