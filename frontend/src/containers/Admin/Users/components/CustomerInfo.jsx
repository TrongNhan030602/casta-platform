import { formatDateOnly } from "@/utils/formatDateOnly";

const CustomerInfo = ({ customer }) => (
  <div>
    <ul>
      <li>
        <strong>Họ tên:</strong> {customer.name}
      </li>
      <li>
        <strong>Điện thoại:</strong> {customer.phone}
      </li>
      <li>
        <strong>Địa chỉ:</strong> {customer.address}
      </li>
      <li>
        <strong>Giới tính:</strong> {customer.gender}
      </li>
      <li>
        <strong>Ngày sinh:</strong> {formatDateOnly(customer.dob)}
      </li>
    </ul>
  </div>
);

export default CustomerInfo;
