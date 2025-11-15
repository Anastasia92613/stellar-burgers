import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router';
import { Preloader } from '../ui/preloader/preloader';
import {
  getUserIsAuhCheckedSelector,
  getUserSelector
} from '../../services/selectors/userSelector/userSelector';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  //  isAuthCheckedSelector — селектор получения состояния загрузки пользователя
  const isAuthChecked = useSelector(getUserIsAuhCheckedSelector);

  //  userDataSelector — селектор получения пользователя из store
  const user = useSelector(getUserSelector);
  const location = useLocation();

  // пока идёт чекаут пользователя , показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  //  если маршрут для авторизованного пользователя, но пользователь неавторизован, то делаем редирект
  if (!onlyUnAuth && !user) {
    // в поле from объекта location.state записываем информацию о URL
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    //  если маршрут для неавторизованного пользователя, но пользователь авторизован
    // при обратном редиректе  получаем данные о месте назначения редиректа из объекта location.state
    // в случае если объекта location.state?.from нет — а такое может быть , если мы зашли на страницу логина по прямому URL
    // мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return children;
};
