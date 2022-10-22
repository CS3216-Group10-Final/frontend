import { User } from "@api/types";
import { Box, Title } from "@mantine/core";
import React, { useEffect } from "react";

type Props = {
  user: User;
};

const ActivitySection = (props: Props) => {
  const { user } = props;

  return (
    <Box>
      <Title align="center">Activity</Title>
    </Box>
  );
};

export default ActivitySection;
