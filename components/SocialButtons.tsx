import { Button, ButtonProps } from "@mantine/core";
import { AiFillFacebook, AiOutlineTwitter } from "react-icons/ai";
import { FcGoogle } from 'react-icons/fc';

export function GoogleButton(props: ButtonProps) {
  return <Button leftIcon={<FcGoogle />} variant="default" {...props} />;
}

// Twitter button as anchor
export function TwitterButton(props: ButtonProps) {
  return (
    <Button
      leftIcon={<AiOutlineTwitter size={16} color="#00ACEE" />}
      variant="default"
      {...props}
    />
  );
}

export function FaceBookButton(props: ButtonProps) {

  return (
    <Button
      leftIcon={<AiFillFacebook size={16} color="#4267B2" />}
      variant="default"
      {...props}
    />
  );
}