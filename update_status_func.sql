CREATE OR REPLACE FUNCTION update_visit_status()
RETURNS void AS $$
BEGIN
    UPDATE visits
    SET status = 'current'
    WHERE status = 'upcoming'
      AND date <= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

