import { Tag } from "antd";
import { ProcessStatus } from "../types/common/ProcessStatus";

export const getStatusTag = (status: ProcessStatus) => {
  switch (status) {
    case ProcessStatus.PendingApproval:
      return <Tag color="purple">Chờ phê duyệt</Tag>;

    case ProcessStatus.Planned:
      return <Tag color="blue">Đã lên kế hoạch</Tag>;

    case ProcessStatus.InProgress:
      return <Tag color="orange">Đang thực hiện</Tag>;

    case ProcessStatus.Completed:
      return <Tag color="green">Hoàn thành</Tag>;

    case ProcessStatus.Cancelled:
      return <Tag color="red">Đã hủy</Tag>;

    case ProcessStatus.Overdue:
      return <Tag color="volcano">Quá hạn</Tag>;

    case ProcessStatus.Paused:
      return <Tag color="gold">Tạm dừng</Tag>;

    case ProcessStatus.PartiallyCompleted:
      return <Tag color="gold">Hoàn thành một phần</Tag>;

    default:
      return <Tag>Không xác định</Tag>;
  }
};

export const getStatusText = (status: ProcessStatus) => {
  switch (status) {
    case ProcessStatus.PendingApproval:
      return "Chờ phê duyệt";

    case ProcessStatus.Planned:
      return "Đã lên kế hoạch";

    case ProcessStatus.InProgress:
      return "Đang thực hiện";

    case ProcessStatus.Completed:
      return "Hoàn thành";

    case ProcessStatus.Cancelled:
      return "Đã hủy";

    case ProcessStatus.Overdue:
      return "Quá hạn";

    case ProcessStatus.Paused:
      return "Tạm dừng";

    case ProcessStatus.PartiallyCompleted:
      return "Hoàn thành một phần";

    default:
      return "Không xác định";
  }
};
