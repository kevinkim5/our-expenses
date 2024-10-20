import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { GoogleOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";

import { AUTH_STATUS } from "@/constants/common";

const { Title } = Typography;

export default function LoginPage() {
  const { status } = useSession();
  useEffect(() => {
    if (status === AUTH_STATUS.AUTH) {
      console.log("logged in successfully, time to save in DB");
    }
  }, [status]);
  return (
    <>
      <Title level={2}>You are not signed in.</Title>
      <Button icon={<GoogleOutlined />} onClick={() => signIn("google")}>
        Sign in with Google
      </Button>
    </>
  );
}
