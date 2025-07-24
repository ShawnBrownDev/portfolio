-- Insert experience data into the experiences table
-- Migration: 20241220000000_insert_experiences.sql

-- Insert experience data (only if not already exists)
INSERT INTO experiences (title, company, period, description, order_index) 
SELECT * FROM (VALUES
    ('Started Self Learning', 'Started to learn programming', '2019', 'Began my journey into programming and software development', 0),
    ('Started to Learn Lua for Fivem (GTA V Mod)', 'Started to learn Lua for Fivem', '2019-2020', 'Learned Lua programming language for FiveM server development and GTA V modding', 1),
    ('Started My Journey in React.js', 'Started to learn React.js', '2020-2021', 'Began learning React.js framework for building modern web applications', 2),
    ('Started Learning Tailwind CSS', 'Started to learn Tailwind CSS', '2021-ongoing', 'Mastered Tailwind CSS for rapid UI development and responsive design', 3),
    ('Started Learning TypeScript', 'Started to learn TypeScript', '2021-ongoing', 'Learned TypeScript for type-safe JavaScript development', 4),
    ('Started Learning Next.js', 'Started to learn Next.js', '2020-ongoing', 'Explored Next.js framework for full-stack React applications', 5),
    ('Start my journey in Freelancing', 'Freelancing', '2025-ongoing', 'Began freelancing career offering web development services', 6)
) AS v(title, company, period, description, order_index)
WHERE NOT EXISTS (
    SELECT 1 FROM experiences WHERE title = v.title
); 