import { Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useEffect } from 'react';

import { ResetPassword } from '../../pages/reset-password/reset-password';
import { ConstructorPage } from '../../pages/constructor-page/constructor-page';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { Login } from '../../pages/login/login';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';
import { Profile } from '../../pages/profile/profile';
import { Register } from '../../pages/register/register';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { Feed } from '../../pages/feed/feed';
import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';
import { OrderInfo } from '../../components/order-info/order-info';
import { Modal } from '../../components/modal/modal';
import { AppHeader } from '../../components/app-header/app-header';
import styles from './app.module.css';
import { useDispatch } from '../../services/store';
import { getIngredient } from '../../services/slices/ingredientsSlice/ingredientsSlice';
import { getUser } from '../../services/slices/userSlice/userSlice';

const App = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredient());
    dispatch(getUser());
  }, []);

  const handleCloseModal = () => {
    window.history.back();
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />}>
          <Route
            path='ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Route>
        <Route path='/feed' element={<Feed />}>
          <Route
            path=':number'
            element={
              <Modal title='Детали заказа' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Route>
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        >
          <Route
            path=':number'
            element={
              <Modal title='Информация о заказе' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Route>
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
