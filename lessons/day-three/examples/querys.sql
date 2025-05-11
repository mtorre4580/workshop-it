-- Table users creation
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATE DEFAULT (DATE('now'))
);

-- DELETE table
DROP TABLE users;

-- Add some users
INSERT INTO users (email, password) VALUES ('ana@example.com', hex(randomblob(16))), ('luis@example.com', hex(randomblob(16))), ('maria@example.com', hex(randomblob(16)));

-- Give me all the results from the table users
SELECT * FROM users;

-- Give me the email from the table users all results
SELECT email FROM users;

-- Find the email "ana@example.com"
SELECT * FROM users WHERE email = "ana@example.com";

-- Limit the results to avoid list all of them
SELECT * FROM users LIMIT 1;

-- DELETE user
DELETE FROM users WHERE id = 2;

-- UPDATE some user
UPDATE users SET email = 'nicolas-updated@example.com' WHERE email = 'nicolas@example.com';
UPDATE users SET password = '78910' where id = 4;

-----------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Table posts creation
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add some posts
INSERT INTO posts (user_id, title, content) VALUES (3, 'How to build APIs', 'To build APIs you need...');
INSERT into posts (user_id, title, content) VALUES (2, 'My first job in IT', 'My first job was in...');
INSERT into posts (user_id, title, content) VALUES (2, 'What is docker?', 'Docker is a tool to allow to...');

-- Order the results by "user_id"
SELECT * FROM posts ORDER BY user_id DESC;

-- Find results where user_id is 3 or 2
SELECT * FROM posts WHERE user_id = 3 OR user_id = 2;

-- Get the total of posts that we have
SELECT COUNT(*) FROM posts;

-- Change the name of the column for easy manipulation
SELECT user_id as userId FROM posts;

-- Get the total of posts from a specific user
SELECT COUNT(*) as total_posts FROM posts WHERE user_id = 2 GROUP BY user_id;

-- Join tables
SELECT users.email, posts.title, posts.content FROM posts JOIN users on posts.user_id = users.id;
