import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { constructorItemsSelector } from '../../services/selectors/constructorItemsSelector/constructorItemsSelector';
import {
  orderBurgerRequestSelector,
  orderBurgerSelector
} from '../../services/selectors/orderBurgerSelector/orderBurgerSelector';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrder,
  orderBurger
} from '../../services/slices/orderBurgerSlice/orderBurgerSlice';
import { getUserSelector } from '../../services/selectors/userSelector/userSelector';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearConstructor } from '../../services/slices/constructorItemsSlice/constructorItemsSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const constructorItems = useSelector(constructorItemsSelector);
  const user = useSelector(getUserSelector);

  const orderRequest = useSelector(orderBurgerRequestSelector);

  const orderModalData = useSelector(orderBurgerSelector) ?? null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    const ingredientsId = constructorItems.ingredients.map((item) => item._id);
    dispatch(
      orderBurger([
        constructorItems.bun._id,
        ...ingredientsId,
        constructorItems.bun._id
      ])
    );
    dispatch(clearConstructor());
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
