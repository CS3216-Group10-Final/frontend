import { Box, Center, Group, Progress, Text } from "@mantine/core";
import { TbCheck, TbX } from "react-icons/tb";

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text color={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? <TbCheck size={14} /> : <TbX size={14} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  // { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 7 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

interface Props {
  password: string;
  passwordStrength: number;
  setPasswordStrength: (_: number) => void;
}

export function PasswordStrength({
  password,
  passwordStrength,
  setPasswordStrength,
}: Props) {
  setPasswordStrength(getStrength(password));
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(password)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          password.length > 0 && index === 0
            ? 100
            : passwordStrength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={
          passwordStrength > 80
            ? "teal"
            : passwordStrength > 50
            ? "yellow"
            : "red"
        }
        key={index}
        size={4}
      />
    ));

  return (
    <div>
      <Group spacing={5} grow mt="xs" mb="md">
        {bars}
      </Group>

      <PasswordRequirement
        label="Has at least 8 characters"
        meets={password.length > 7}
      />
      {checks}
    </div>
  );
}

// From https://ui.mantine.dev/category/inputs
