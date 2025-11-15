import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { orderFeedsSelector } from '../../services/selectors/ordersSelector/ordersSelector';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/slices/ordersSlice/ordersSlice';
import { orderBurgerSuccessSelector } from '../../services/selectors/orderBurgerSelector/orderBurgerSelector';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const success = useSelector(orderBurgerSuccessSelector);

  useEffect(() => {
    dispatch(getFeeds());
  }, [success]);

  const orders: TOrder[] = useSelector(orderFeedsSelector);

  if (!orders.length) {
    return <Preloader />;
  }
  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
