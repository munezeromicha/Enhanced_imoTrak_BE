import argon2 from 'argon2';

export const hashPassword = async (plainPassword) => {
  return await argon2.hash(plainPassword);
};

export const verifyPassword = async (hash, plainPassword) => {
  return await argon2.verify(hash, plainPassword);
};
