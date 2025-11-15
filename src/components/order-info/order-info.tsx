import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { ingredientsSelector } from '../../services/selectors/ingredientsSelector/ingredientsSelector';
import { useSelector } from '../../services/store';
import { orderFeedsSelector } from '../../services/selectors/ordersSelector/ordersSelector';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const orders: TOrder[] = useSelector(orderFeedsSelector);
  const { number } = useParams();
  if (!number) return <Preloader />;

  const orderData = orders.find((item) => item.number === parseInt(number));

  const ingredients: TIngredient[] = useSelector(ingredientsSelector);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
