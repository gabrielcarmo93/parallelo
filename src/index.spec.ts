import { parallelo } from '../src';

describe('parallelo', () => {
  it('resolves all items successfully (sync function)', async () => {
    const items = [1, 2, 3];
    const { results, errors } = await parallelo(items, 2, (n: number) => n * 2);

    expect(results).toHaveLength(3);
    expect(errors).toHaveLength(0);
    expect(results.map(r => r.result)).toEqual([2, 4, 6]);
  });

  it('resolves all items successfully (async function)', async () => {
    const items = ['a', 'b', 'c'];
    const { results, errors } = await parallelo(items, 1, async (s: string) => s.toUpperCase());

    expect(results).toHaveLength(3);
    expect(errors).toHaveLength(0);
    expect(results.map(r => r.result)).toEqual(['A', 'B', 'C']);
  });

  it('handles errors correctly', async () => {
    const items = [1, 2, 3];
    const { results, errors } = await parallelo(items, 2, async (n: number) => {
      if (n === 2) throw new Error('fail');
      return n;
    });

    expect(results).toHaveLength(2);
    expect(errors).toHaveLength(1);
    expect(errors[0].item).toBe(2);
    expect((errors[0].error as Error).message).toBe('fail');
  });

  it('limits concurrency (indirectly tested by delay)', async () => {
    const order: number[] = [];
    const items = [1, 2, 3];
    const { results } = await parallelo(items, 1, async (n: number) => {
      await new Promise(res => setTimeout(res, 50));
      order.push(n);
      return n;
    });

    expect(order).toEqual([1, 2, 3]);
    expect(results.map(r => r.result)).toEqual([1, 2, 3]);
  });

  it('returns empty results on empty input', async () => {
    const { results, errors } = await parallelo([], 3, async () => 42);
    expect(results).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });
});
