/**
 * Reverse an string
 * Example: 'hello' -> 'olleh'
 * @param {string} text
 * @returns string
 */

const v1 = (text) => {
  return text.split("").reverse().join("");
};

const v2 = (text) => {
  let result = "";

  for (let i = text.length - 1; i >= 0; i--) {
    result += text[i];
  }

  return result;
};

v1("hello");
v2("hello");
