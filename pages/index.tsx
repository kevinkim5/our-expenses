import LoginPage from "@/components/LoginPage";
import { AUTH_STATUS } from "@/constants/common";
import { Typography } from "antd";
import { useSession, signOut } from "next-auth/react";

const { Title } = Typography;

export default function IndexPage() {
  const { data, status } = useSession();
  console.log(data)
  return (
    <>
      <Title>Expenses Tracker</Title>
      {status === AUTH_STATUS.LOADING ? (
        <Title level={2}>Loading... Please wait</Title>
      ) : status === AUTH_STATUS.AUTH ? (
        <div>
          <h1> Hi {data?.user?.name}</h1>
          <img src={data?.user?.image} alt={data?.user?.name + " photo"} />
          <button onClick={signOut}>sign out</button>
        </div>
      ) : (
        <LoginPage />
      )}
    </>
  );
}
