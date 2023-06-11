const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
} = require('../../src/model/data/memory/index');

describe('Memory Database Backend Test', () => {
  const ownerId = 'owner';
  const id = 'id';
  const data = Buffer.from([1, 2, 3]);

  // New database instance for each test
  beforeEach(async () => {
    await writeFragment({ ownerId, id });
    await writeFragmentData(ownerId, id, data);
  });

  test('readFragment() returns current fragment', async () => {
    const fragment = await readFragment(ownerId, id);
    expect(fragment).toEqual({ ownerId, id });
  });

  test('readFragmentData() returns current fragment data', async () => {
    const fragmentData = await readFragmentData(ownerId, id);
    expect(fragmentData).toEqual(data);
  });

  test('writeFragment() overwrites current fragment', async () => {
    const newFragment = { ownerId, id, value: 123 };
    await writeFragment(newFragment);
    const fragment = await readFragment(ownerId, id);
    expect(fragment).toEqual(newFragment);
  });

  test('writeFragmentData() overwrites current fragment data', async () => {
    const newData = Buffer.from([4, 5, 6]);
    await writeFragmentData(ownerId, id, newData);
    const fragmentData = await readFragmentData(ownerId, id);
    expect(fragmentData).toEqual(newData);
  });
});
