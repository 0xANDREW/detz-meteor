PEOPLE = new Mongo.Collection('people');
DEBTS = new Mongo.Collection('debts');

var schemas = {
    person: new SimpleSchema({
        first_name: { type: String },
        last_name: { type: String }
    }),

    debt: new SimpleSchema({
        description: { type: String },
        amount: { type: Number, decimal: true },
        date: { type: Date },
        paid: { type: Boolean },
        person_id: { type: String }
    })
};

PEOPLE.attachSchema(schemas.person);
DEBTS.attachSchema(schemas.debt);

DEFAULT_SORT_MODIFIERS = [[ 'date', 'desc' ]];    
