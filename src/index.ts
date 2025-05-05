export async function parallelo<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R> | R
): Promise<{
  results: { item: T; result: R }[];
  errors: { item: T; error: Error }[];
}> {
  const queue = [...items];
  const results: { item: T; result: R }[] = [];
  const errors: { item: T; error: Error }[] = [];

  const worker = async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item !== undefined) {
        try {
          const result = await fn(item);
          results.push({ item, result });
        } catch (error) {
          errors.push({ item, error: error as Error });
        }
      }
    }
  };

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return { results, errors };
}