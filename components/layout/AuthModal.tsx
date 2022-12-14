import {
  getGoogleAuthLinkApi,
  loginApi,
  registerUserApi,
} from "@api/authentication/authentication_api";
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { PasswordStrength } from "@components/PasswordStrength";
import {
  Anchor,
  Button,
  Divider,
  Group,
  Modal,
  PasswordInput,
  Space,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useAppDispatch } from "@redux/hooks";
import { getSelfUser } from "@redux/slices/User_slice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { showSuccessNotification } from "utils/notifications";
import { GoogleButton } from "../SocialButtons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [googleAuthLink, setGoogleAuthLink] = useState<string>("");
  const theme = useMantineTheme();
  const isScreenSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const [modalType, setModalType] = useState<"login" | "register">("login");
  const dispatch = useAppDispatch();

  useEffect(() => {
    getGoogleAuthLinkApi()
      .then((link) => {
        setGoogleAuthLink(link);
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
  }, []);

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
      password: (value) => {
        if (modalType === "login") {
          return value ? null : "Password cannot be empty";
        } else {
          return passwordStrength === 100
            ? null
            : "Password does not meet requirements";
        }
      },
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
          return dispatch(getSelfUser()).unwrap();
        })
        .then((user) => {
          if (router.pathname === "/") {
            router.push(`/user/${user.username}`);
          }
          handleClose();
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        })
        .finally(() => setLoading(false));
    } else if (modalType === "register") {
      registerUserApi({ email, username, password })
        .then(() => {
          return loginApi({ email, password });
        })
        .then(() => {
          return dispatch(getSelfUser()).unwrap();
        })
        .then((user) => {
          if (router.pathname === "/") {
            router.push(`/user/${user.username}`);
          }
          handleClose();
          showSuccessNotification({
            title: "Successfully registered!",
            message: `Welcome ${username}!`,
          });
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        })
        .finally(() => setLoading(false));
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      centered
      opened={isOpen}
      onClose={handleClose}
      size={isScreenSmall ? "sm" : "md"}
      title={modalType == "register" ? "Register an account" : "Welcome Back!"}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {modalType === "login" && (
            <Stack>
              <GoogleButton link={googleAuthLink}>
                Login with Google
              </GoogleButton>
              <Divider />
            </Stack>
          )}
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
          {modalType === "register" && (
            <PasswordStrength
              password={form.values.password}
              passwordStrength={passwordStrength}
              setPasswordStrength={setPasswordStrength}
            />
          )}
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
