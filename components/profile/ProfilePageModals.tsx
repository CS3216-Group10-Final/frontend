import { changePasswordApi } from "@api/authentication/authentication_api";
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { PasswordStrength } from "@components/PasswordStrength";
import {
  Button,
  Center,
  FileInput,
  Group,
  Image,
  Modal,
  PasswordInput,
  Space,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  selectUserBio,
  updateBio,
  updateProfilePic,
  updateUsername,
} from "@redux/slices/User_slice";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { showSuccessNotification } from "utils/notifications";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export const UploadProfileModal = (props: Props) => {
  const dispatch = useAppDispatch();
  const { opened, onClose } = props;

  interface FormValues {
    picture: File | null;
  }

  const form = useForm<FormValues>({
    initialValues: {
      picture: null,
    },

    validate: {
      picture: (value: File | null) =>
        value ? null : "Please upload your picture",
    },
  });

  const handleSubmit = (values: FormValues) => {
    const { picture } = values;

    // should not happen
    if (!picture) {
      return;
    }

    dispatch(updateProfilePic(picture))
      .unwrap()
      .then(() => {
        onClose();
        showSuccessNotification({
          title: "Picture Uploaded",
          message: "Awesome!",
        });
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
  };

  return (
    <Modal title="Upload Profile Picture" opened={opened} onClose={onClose}>
      <Stack>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {form.values.picture ? (
            <Center mt="md">
              <Image
                width={200}
                height={200}
                src={URL.createObjectURL(form.values.picture)}
                alt="profile picture"
              />
            </Center>
          ) : null}

          <FileInput
            withAsterisk
            mt="md"
            label="Profile Picture"
            placeholder="Upload profile picture"
            accept="image/*"
            {...form.getInputProps("picture")}
          />

          <Group position="right">
            <Button mt="md" type="submit" disabled={!form.isValid()}>
              Upload Picture
            </Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
};

export const UsernameModalContent = () => {
  const router = useRouter();

  interface UsernameForm {
    username: string;
  }

  const dispatch = useAppDispatch();
  const usernameForm = useForm<UsernameForm>({
    initialValues: {
      username: "",
    },

    validate: {
      username: (value) => (value ? null : "Please enter a username"),
    },
  });

  const handleUpdateUsername = ({ username }: UsernameForm) => {
    dispatch(updateUsername(username))
      .unwrap()
      .then(() => {
        showSuccessNotification({
          title: "Username updated",
          message: "Awesome!",
        });

        router.replace(`/user/${username}`);
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      })
      .finally(() => closeAllModals());
  };

  return (
    <form onSubmit={usernameForm.onSubmit(handleUpdateUsername)}>
      <TextInput
        label="Enter your username"
        placeholder="Username"
        withAsterisk
        {...usernameForm.getInputProps("username")}
      />
      <Space h="md" />
      <Button type="submit" fullWidth>
        Change
      </Button>
    </form>
  );
};

export const BioModalContent = () => {
  const dispatch = useAppDispatch();
  const bio = useAppSelector(selectUserBio);
  const [tempBio, setTempBio] = useState<string>("");

  useEffect(() => {
    setTempBio(bio);
  }, [bio]);

  const handleUpdateBio = () => {
    dispatch(updateBio(tempBio))
      .unwrap()
      .then(() => {
        showSuccessNotification({
          title: "Bio updated",
          message: "Awesome!",
        });
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      })
      .finally(() => closeAllModals());
  };

  return (
    <>
      <Textarea
        label="Enter your bio"
        placeholder="Bio"
        withAsterisk
        autosize
        minRows={2}
        maxRows={6}
        value={tempBio}
        onChange={(event: ChangeEvent) =>
          setTempBio((event.currentTarget as HTMLInputElement).value)
        }
      />
      <Space h="md" />
      <Button onClick={handleUpdateBio} fullWidth>
        Change
      </Button>
    </>
  );
};

export const ChangePasswordModal = (props: Props) => {
  const { opened, onClose } = props;
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  interface FormValues {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }

  const form = useForm<FormValues>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },

    validate: {
      oldPassword: (value) => (value ? null : "Please enter your old password"),
      newPassword: () => {
        return passwordStrength === 100
          ? null
          : "Password does not meet requirements";
      },
      confirmNewPassword: (value, values) => {
        if (value !== values.newPassword) {
          return "Passwords do not match";
        }
        return value ? null : "Please confirm your new password";
      },
    },
  });

  const handleSubmit = (values: FormValues) => {
    const { oldPassword, newPassword } = values;
    setLoading(true);
    changePasswordApi(oldPassword, newPassword)
      .then(() => {
        onClose();
        showSuccessNotification({
          title: "Success!",
          message: `Password successfully changed`,
        });
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal title="Change Password" opened={opened} onClose={onClose}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <PasswordInput
            label="Old Password"
            withAsterisk
            {...form.getInputProps("oldPassword")}
          />
          <PasswordInput
            label="New Password"
            withAsterisk
            {...form.getInputProps("newPassword")}
          />
          <PasswordStrength
            password={form.values.newPassword}
            passwordStrength={passwordStrength}
            setPasswordStrength={setPasswordStrength}
          />
          <PasswordInput
            label="Confirm New Password"
            withAsterisk
            {...form.getInputProps("confirmNewPassword")}
          />
          <Button type="submit" fullWidth loading={loading}>
            Change Password
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
