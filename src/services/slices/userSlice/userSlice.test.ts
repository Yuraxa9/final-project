import userSlice, {
  getUser,
  getOrdersAll,
  initialState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
  userLogout,
  resetError
} from './userSlice';
import { expect, test, describe } from '@jest/globals';

describe('тестирование редьюсера userSlice', () => {
  describe('тестирование синхронных экшенов', () => {
    test('тест экшена userLogout', () => {
      const state = {
        ...initialState,
        userData: {
          name: 'Test User',
          email: 'test@example.com'
        }
      };
      const newState = userSlice(state, userLogout());
      expect(newState.userData).toBeNull();
    });

    test('тест экшена resetError', () => {
      const state = {
        ...initialState,
        error: 'Some error'
      };
      const newState = userSlice(state, resetError());
      expect(newState.error).toBeNull();
    });
  });

  describe('тестирование асинхронного GET экшена getUser', () => {
    const actions = {
      pending: {
        type: getUser.pending.type,
        payload: null
      },
      rejected: {
        type: getUser.rejected.type,
        payload: null
      },
      fulfilled: {
        type: getUser.fulfilled.type,
        payload: { user: { name: 'someName', email: 'someEmail' } }
      }
    };

    test('тест синхронного экшена getUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('тест синхронного экшена getUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.payload);
    });

    test('тест синхронного экшена getUser.fulfilled', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.userData).toEqual(actions.fulfilled.payload.user);
    });
  });
  describe('тестирование асинхронного GET экшена getOrdersAll', () => {
    const actions = {
      pending: {
        type: getOrdersAll.pending.type,
        payload: null
      },
      rejected: {
        type: getOrdersAll.rejected.type,
        error: { message: 'Funny mock-error' }
      },
      fulfilled: {
        type: getOrdersAll.fulfilled.type,
        payload: ['order1', 'order2']
      }
    };

    test('тест синхронного экшена getOrdersAll.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('тест синхронного экшена getOrdersAll.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('тест синхронного экшена getOrdersAll.fulfilled', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.userOrders).toEqual(actions.fulfilled.payload);
    });
  });

  describe('тестирование асинхронного POST экшена registerUser', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const actions = {
      pending: {
        type: registerUser.pending.type
      },
      rejected: {
        type: registerUser.rejected.type,
        error: { message: 'Registration failed' }
      },
      fulfilled: {
        type: registerUser.fulfilled.type,
        payload: {
          user: mockUser,
          success: true
        }
      }
    };

    test('тест экшена registerUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });

    test('тест экшена registerUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
      expect(state.isAuthChecked).toBe(false);
    });

    test('тест экшена registerUser.fulfilled', () => {
      const state = userSlice(initialState, actions.fulfilled);
      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
      expect(state.response).toEqual(mockUser);
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(true);
    });
  });
  describe('тестирование асинхронного POST экшена loginUser', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const actions = {
      pending: {
        type: loginUser.pending.type
      },
      rejected: {
        type: loginUser.rejected.type,
        error: { message: 'Login failed' }
      },
      fulfilled: {
        type: loginUser.fulfilled.type,
        payload: {
          user: mockUser,
          success: true
        }
      }
    };

    test('тест экшена loginUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.loginUserRequest).toBe(true);
      expect(state.error).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });

    test('тест экшена loginUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
      expect(state.isAuthChecked).toBe(false);
    });

    test('тест экшена loginUser.fulfilled', () => {
      const state = userSlice(initialState, actions.fulfilled);
      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBeNull();
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(true);
    });
  });
  describe('тестирование асинхронного PATCH экшена updateUser', () => {
    const mockUser = {
      name: 'Updated User',
      email: 'updated@example.com'
    };

    const actions = {
      pending: {
        type: updateUser.pending.type
      },
      rejected: {
        type: updateUser.rejected.type,
        error: { message: 'Update failed' }
      },
      fulfilled: {
        type: updateUser.fulfilled.type,
        payload: {
          user: mockUser,
          success: true
        }
      }
    };

    test('тест экшена updateUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    test('тест экшена updateUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('тест экшена updateUser.fulfilled', () => {
      const state = userSlice(initialState, actions.fulfilled);
      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
      expect(state.response).toEqual(mockUser);
    });
  });
  describe('тестирование асинхронного POST экшена logoutUser', () => {
    const actions = {
      pending: {
        type: logoutUser.pending.type
      },
      rejected: {
        type: logoutUser.rejected.type,
        error: { message: 'Logout failed' }
      },
      fulfilled: {
        type: logoutUser.fulfilled.type
      }
    };

    test('тест экшена logoutUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
      expect(state.request).toBe(true);
    });

    test('тест экшена logoutUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
      expect(state.request).toBe(false);
    });

    test('тест экшена logoutUser.fulfilled', () => {
      const state = userSlice(initialState, actions.fulfilled);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(false);
      expect(state.error).toBeNull();
      expect(state.request).toBe(false);
      expect(state.userData).toBeNull();
    });
  });
});
