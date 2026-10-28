// Supabase の「Project URL」と「Publishable key（sb_publishable_…）」に置き換えてください。
// 入れてよいのは Publishable key だけです（古い画面では anon key）。
// Secret key（sb_secret_…）・service_role key は絶対に入れないでください。
const SB_URL = 'https://zxuxphlkktxeklkrhctf.supabase.co';
const SB_KEY = 'ssb_publishable_OUcJEyLHdFJfzEeF3dBDRw_1qOs40UA';
const sb = supabase.createClient(SB_URL, SB_KEY);
