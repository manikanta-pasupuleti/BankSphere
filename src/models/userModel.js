import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (userData) => {
  const { firstName, lastName, email, phone, address, city, state, postalCode, country } = userData;
  const id = uuidv4();
  
  const result = await pool.query(
    `INSERT INTO users (id, first_name, last_name, email, phone, address, city, state, postal_code, country)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [id, firstName, lastName, email, phone, address, city, state, postalCode, country]
  );
  
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
  return result.rows;
};

export const updateUser = async (id, userData) => {
  const { firstName, lastName, email, phone, address, city, state, postalCode, country } = userData;
  
  const result = await pool.query(
    `UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5, 
                      city = $6, state = $7, postal_code = $8, country = $9, updated_at = CURRENT_TIMESTAMP
     WHERE id = $10 RETURNING *`,
    [firstName, lastName, email, phone, address, city, state, postalCode, country, id]
  );
  
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
