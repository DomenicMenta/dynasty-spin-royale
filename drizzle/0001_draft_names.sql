ALTER TABLE dynasty_results ADD COLUMN draft_name TEXT;

CREATE INDEX IF NOT EXISTS idx_dynasty_results_named_scores
ON dynasty_results(franchise_value DESC, created_at ASC)
WHERE draft_name IS NOT NULL;

PRAGMA optimize;
