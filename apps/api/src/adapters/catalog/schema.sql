CREATE TABLE sagas (
  name text PRIMARY KEY,
  episode_price_in_cents integer NOT NULL CHECK (episode_price_in_cents >= 0)
);

CREATE TABLE saga_discount_tiers (
  saga text NOT NULL REFERENCES sagas (name),
  min_distinct_movies integer NOT NULL CHECK (min_distinct_movies > 0),
  percent integer NOT NULL CHECK (percent BETWEEN 1 AND 100),
  PRIMARY KEY (saga, min_distinct_movies)
);

CREATE TABLE shop_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  unlisted_movie_price_in_cents integer NOT NULL CHECK (unlisted_movie_price_in_cents >= 0)
);

INSERT INTO sagas (name, episode_price_in_cents) VALUES ('Back to the Future', 1500);

INSERT INTO saga_discount_tiers (saga, min_distinct_movies, percent) VALUES
  ('Back to the Future', 2, 10),
  ('Back to the Future', 3, 20);

INSERT INTO shop_settings (unlisted_movie_price_in_cents) VALUES (2000);
