import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { ordersSelector } from '../../services/selectors/ordersSelector';
import { useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(ordersSelector);

  return <ProfileOrdersUI orders={orders} />;
};
