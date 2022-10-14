/**
 * This page is only for redirection upon Google OAuth login
 */

import TokenService from "@api/authentication/token_service";
import {
  ErrorType,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { Text } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const GoogleAuthRedirect: NextPage = () => {
  const router = useRouter();
  const { refresh, access } = router.query;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (typeof refresh == "string" && typeof access == "string") {
      TokenService.setTokens({ refreshToken: refresh, accessToken: access });
    } else {
      showApiRequestErrorNotification({
        errorType: ErrorType.TOKEN_NOT_VALID,
        name: "",
        message: "",
      });
    }
    router.push("/");
  }, [router.isReady]);

  return <Text>Redirecting...</Text>;
};

export default GoogleAuthRedirect;
