import React, { useEffect, useState } from "react";
import { ProfileOutlined, PlusOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Row } from "antd";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "View",
    key: "/transactions",
    icon: <ProfileOutlined />,
  },
  {
    label: "Add",
    key: "/add",
    icon: <PlusOutlined />,
  },
];

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  // paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  // const { status } = useSession();
  const [current, setCurrent] = useState<string>(pathname || "");
  console.log(pathname);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    router.push(e.key);
    setCurrent(e.key);
  };

  useEffect(() => {
    setCurrent(pathname || "");
  }, [pathname]);

  return (
    <Row style={headerStyle}>
      <Menu
        theme="dark"
        mode="horizontal"
        // defaultSelectedKeys={["2"]}
        items={items}
        onClick={onClick}
        style={{ flex: 1, minWidth: 0 }}
        selectedKeys={[current]}
      />
    </Row>
  );
}
