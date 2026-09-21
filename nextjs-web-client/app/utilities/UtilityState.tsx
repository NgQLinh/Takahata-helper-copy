import { Tag } from "antd";
import { ProcessStatus } from "../types/common/ProcessStatus";

export const getStatusTag = (status: ProcessStatus) => {
  switch (status) {
    case ProcessStatus.Planned:
      return <Tag color="blue">Đã lên kế hoạch</Tag>;
    case ProcessStatus.InProgress:
      return <Tag color="orange">Đang thực hiện</Tag>;
    case ProcessStatus.Completed:
      return <Tag color="green">Hoàn thành</Tag>;
    case ProcessStatus.Cancelled:
      return <Tag color="red">Đã hủy</Tag>;
    case ProcessStatus.PartiallyCompleted:
      return <Tag color="gold">Hoàn thành một phần</Tag>;
    case ProcessStatus.Paused:
      return <Tag color="gold">Tạm dừng</Tag>;
    default:
      return <Tag>Không xác định</Tag>;
  }
};
