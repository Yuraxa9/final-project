import orderSlice, {
  getOrderByNumber,
  initialState
} from './orderSlice';
import { expect, test, describe } from '@jest/globals';

describe('тестирование редьюсера orderSlice', () => {
  describe('тестирование асинхронного экшена getOrderByNumber', () => {
    const mockOrder = {
      _id: '1',
      ingredients: ['ingredient1', 'ingredient2'],
      status: 'done',
      name: 'Test Order',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      number: 1
    };

    const actions = {
      pending: {
        type: getOrderByNumber.pending.type
      },
      rejected: {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Get order failed' }
      },
      fulfilled: {
        type: getOrderByNumber.fulfilled.type,
        payload: {
          orders: [mockOrder]
        }
      }
    };

    test('тест экшена getOrderByNumber.pending', () => {
      const state = orderSlice(initialState, actions.pending);
      expect(state.error).toBeNull();
      expect(state.request).toBe(true);
    });

    test('тест экшена getOrderByNumber.rejected', () => {
      const state = orderSlice(initialState, actions.rejected);
      expect(state.error).toBe(actions.rejected.error.message);
      expect(state.request).toBe(false);
    });

    test('тест экшена getOrderByNumber.fulfilled', () => {
      const state = orderSlice(initialState, actions.fulfilled);
      expect(state.error).toBeNull();
      expect(state.request).toBe(false);
      expect(state.orderByNumberResponse).toEqual(mockOrder);
    });
  });
});
