import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { ordersSelector } from '../../services/selectors/ordersSelector';
import { useDispatch, useSelector } from '../../services/store';
import { orderBurgerSuccessSelector } from '../../services/selectors/orderBurgerSelector';
import { getUserOrders } from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const success = useSelector(orderBurgerSuccessSelector);
  useEffect(() => {
    dispatch(getUserOrders());
  }, [success]);
  const orders: TOrder[] = useSelector(ordersSelector);

  return <ProfileOrdersUI orders={orders} />;
};
