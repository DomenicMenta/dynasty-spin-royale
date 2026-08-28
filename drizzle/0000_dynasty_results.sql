CREATE TABLE IF NOT EXISTS dynasty_results (
  id TEXT PRIMARY KEY NOT NULL,
  franchise_value REAL NOT NULL,
  roster_points REAL NOT NULL,
  unspent_dv INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dynasty_results_franchise_value
ON dynasty_results(franchise_value DESC);

PRAGMA optimize;
