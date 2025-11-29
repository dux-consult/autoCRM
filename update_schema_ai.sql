-- Add script column to tasks table for AI-generated call scripts
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'tasks' and column_name = 'script') then
    alter table tasks add column script text;
  end if;
end $$;
