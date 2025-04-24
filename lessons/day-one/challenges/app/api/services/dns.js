const dns = require("dns").promises;

const resolveDomain = (domain) => {
  return dns.resolve4(domain);
};

module.exports = { resolveDomain };
