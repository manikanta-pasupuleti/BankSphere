import pool from '../config/database.js';

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, first_name, last_name, email, phone, address, city, state, postal_code, country, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const createAuthUser = async (userData) => {
  const result = await pool.query(
    `INSERT INTO users (
      id, first_name, last_name, email, password_hash, role,
      phone, address, city, state, postal_code, country
    )
    VALUES (gen_random_uuid(), $1, $2, $3, $4, 'CUSTOMER', $5, $6, $7, $8, $9, $10)
    RETURNING id, first_name, last_name, email, phone, address, city, state, postal_code, country, role, created_at, updated_at`,
    [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.passwordHash,
      userData.phone,
      userData.address,
      userData.city,
      userData.state,
      userData.postalCode,
      userData.country
    ]
  );
  return result.rows[0];
};
