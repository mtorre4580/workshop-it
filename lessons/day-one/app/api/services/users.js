const { faker } = require("@faker-js/faker");

const getUsers = (total = 10) => {
  return faker.helpers.multiple(
    () => ({
      userId: faker.string.uuid(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
    }),
    {
      count: total,
    }
  );
};

module.exports = { getUsers };
