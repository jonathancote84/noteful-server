CREATE TABLE noteful_folders (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL 
);

-- CREATE TABLE noteful_notes (
--     id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
--     name TEXT NOT NULL,
--     modified TIMESTAMP NOT NULL DEFAULT now(),
--     folder_id INTEGER 
--         REFERENCES noteful_folders(id) ON DELETE CASCADE NOT NULL,
-- );

-- to add users 
-- CREATE TABLE noteful_users (
--     id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
--     fullname TEXT NOT NULL,
--     username TEXT NOT NULL UNIQUE,
--     password TEXT,
--     nickname TEXT,
--     date_created TIMESTAMP NOT NULL DEFAULT now()
-- );