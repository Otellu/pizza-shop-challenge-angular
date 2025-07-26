// Simple test setup without complex database integration
jest.setTimeout(10000);

// Mock mongoose to avoid database connection issues
jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    dropDatabase: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    collections: {},
  },
  Schema: class MockSchema {
    constructor(definition) {
      this.definition = definition;
    }
  },
  model: jest.fn((name, schema) => {
    // Return a mock model constructor
    return class MockModel {
      constructor(data) {
        Object.assign(this, data);
        this._id = "mock-id-" + Math.random().toString(36).substr(2, 9);
      }

      save() {
        return Promise.resolve(this);
      }

      static find(query = {}) {
        return {
          sort: () => ({
            skip: () => ({
              limit: () => Promise.resolve([]),
            }),
          }),
          populate: () => ({
            sort: () => Promise.resolve([]),
          }),
        };
      }

      static findById() {
        return Promise.resolve(null);
      }

      static findByIdAndUpdate() {
        return {
          populate: () => Promise.resolve(null),
        };
      }

      static findOne() {
        return Promise.resolve(null);
      }

      static countDocuments() {
        return Promise.resolve(0);
      }
    };
  }),
}));

// Clean console output during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
