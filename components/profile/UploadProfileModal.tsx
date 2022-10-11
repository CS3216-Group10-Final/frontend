import { handleApiRequestError } from "@api/error_handling";
import {
  Center,
  FileInput,
  Modal,
  Image,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useAppDispatch } from "@redux/hooks";
import { updateProfilePic } from "@redux/slices/User_slice";
import React from "react";
import { IconCheck } from "@tabler/icons";

type Props = {
  opened: boolean;
  onClose: () => void;
};

const UploadProfileModal = (props: Props) => {
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
      .then(() => {
        console.log("SUCCESS!");
        onClose();
        showNotification({
          title: "Picture Uploaded",
          message: "Awesome!",
          icon: <IconCheck size={18} />,
          color: "teal",
        });
      })
      .catch((error) => {
        console.log(handleApiRequestError(error));
      });
  };

  return (
    <Modal
      title="Upload Profile Picture"
      opened={opened}
      centered
      onClose={onClose}
    >
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

export default UploadProfileModal;
