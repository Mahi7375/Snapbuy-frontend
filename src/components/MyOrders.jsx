import { useAuth } from "../auth/AuthContext";
import Order from "./Order";

const MyOrders = () => {
  const { user } = useAuth();
  return <Order customerEmail={user.email} title="My Orders" />;
};

export default MyOrders;
