import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function LoadingOverlay(props) {
  return (
    <div style={{}}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  );
}
