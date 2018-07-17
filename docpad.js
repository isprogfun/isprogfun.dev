// DocPad Configuration File
// http://docpad.org/docs/config

// Libs
const moment = require('moment');

moment.locale('ru');

// Define the DocPad Configuration
module.exports = {
    regenerateDelay: 0,
    watchOptions: {
        catchupDelay: 0,
    },
    templateData: {
        postCreatedAt(ctime) {
            return moment(ctime).format('DD MMMM YYYY');
        },
        getYear(ctime) {
            return moment(ctime).format('YYYY');
        },
    },
    collections: {
        pages() {
            return this.getCollection('html').findAll({ isPage: true }, [{ order: 1 }]);
        },
        lenta() {
            return this.getCollection('html').findAll({ isPublished: true }, [{ date: -1 }]);
        }
    }
};
