import feedSlice, {
  getFeeds,
  initialState
} from './feedSlice';
import { expect, test, describe } from '@jest/globals';

describe('тестирование редьюсера feedSlice', () => {
  describe('тестирование асинхронного экшена getFeeds', () => {
    const mockOrders = [
      {
        _id: '1',
        ingredients: ['ingredient1', 'ingredient2'],
        status: 'done',
        name: 'Test Order 1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        number: 1
      },
      {
        _id: '2',
        ingredients: ['ingredient3', 'ingredient4'],
        status: 'pending',
        name: 'Test Order 2',
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02',
        number: 2
      }
    ];

    const actions = {
      pending: {
        type: getFeeds.pending.type
      },
      rejected: {
        type: getFeeds.rejected.type,
        error: { message: 'Get feeds failed' }
      },
      fulfilled: {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: mockOrders,
          total: 100,
          totalToday: 10
        }
      }
    };

    test('тест экшена getFeeds.pending', () => {
      const state = feedSlice(initialState, actions.pending);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('тест экшена getFeeds.rejected', () => {
      const state = feedSlice(initialState, actions.rejected);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('тест экшена getFeeds.fulfilled', () => {
      const state = feedSlice(initialState, actions.fulfilled);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
    });
  });
});
