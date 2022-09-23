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

    /**
     * add new records to the supabase DB
     * @param {List<Map>} list 
     * @returns 
     */
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

    
    /**
     * delete records by notice date
     * @param {String} dateStr 
     * @returns 
     */
     async deleteRecordsByDate(dateStr) {
        const { data, error } = await this.client
            .from('Notice')
            .delete()
            .match({ notice_date: dateStr });
        if (error != null) {
            console.error('fail to delete');
            return;
        }
        if (data != null) {
            console.info(`delete success of ${dateStr}`);
        }
    }

    /**
     * delete old 30th day records
     * @returns null
     */
    async deletePreviousRecords() {
        var today = new Date();
        var targetDate =
            new Date(today.getTime() - 24 * 60 * 60 * 1000 * 30);
        const dateFormatter = Intl.DateTimeFormat('sv-SE');
        var dateStr = dateFormatter.format(targetDate);
        await this.deleteRecordsByDate(dateStr)
    }

}

const clientHelper = new SupabaseHelper();

module.exports = clientHelper;
