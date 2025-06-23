CREATE OR REPLACE FUNCTION check_metadata_singleton()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM metadata) >= 1 THEN
        RAISE EXCEPTION 'Only one row allowed in metadata table';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER metadata_singleton_trigger
BEFORE INSERT ON metadata
FOR EACH ROW
EXECUTE FUNCTION check_metadata_singleton();
