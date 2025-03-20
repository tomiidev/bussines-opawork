import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  "https://oixwbstbuooiblrkrepl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peHdic3RidW9vaWJscmtyZXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTA2NjgsImV4cCI6MjA1Nzk2NjY2OH0.o5UVe7899mn1DASAYRu3eMmdw7sIN2oXnEe6BfakQkA"
);
