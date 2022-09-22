const { createClient } = require('@supabase/supabase-js');

class SupabaseHelper {
    constructor() {
        this.client = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_API_KEY,
            {
                schema: 'public',
                headers: {
                    Authorization: `Bearer ${process.env.SUPABASE_SECRET}`,
                },
            }
        );
    }

    async addListToDB(list) {
        const { data, error } = await this.client.from('Notice').insert(list);
        if (error != null) {
            console.error('fail to add data');
            return;
        }
        if (data != null) {
            console.info('upload data success');
        }
    }

    async deletePreviousRecords() {
        var today = new Date();
        var targetDate =
            new Date(today.getTime() - 24 * 60 * 60 * 1000 * 3);
        const dateFormatter = Intl.DateTimeFormat('sv-SE');
        var dateStr = dateFormatter.format(targetDate);
        const { data, error } = await this.client
            .from('Notice')
            .delete()
            .match({ notice_date: dateStr });
        if (error != null) {
            console.error('fail to delete');
            return;
        }
        if (data != null) {
            console.info('delete success');
        }
    }
}

const clientHelper = new SupabaseHelper();

module.exports = clientHelper;
