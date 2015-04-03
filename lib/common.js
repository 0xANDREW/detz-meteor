PEOPLE = new Mongo.Collection('people', {
    transform: function(p){
        var debts = DEBTS.find({ person_id: p._id });
        p.total = 0;

        debts.forEach(function(d){
            if (!d.paid && !d.payment){
                p.total += d.amount;
            }
        });

        return p;
    }
});

DEBTS = new Mongo.Collection('debts');

var schemas = {
    person: new SimpleSchema({
        first_name: { type: String },
        last_name: { type: String },
        created_at: { type: Date },
        updated_at: { type: Date }
    }),

    debt: new SimpleSchema({
        description: { type: String },
        amount: { type: Number, decimal: true },
        date: { type: Date },
        created_at: { type: Date },
        updated_at: { type: Date },
        paid: { type: Boolean },
        person_id: { type: String },
        payment: { type: Boolean }
    })
};

PEOPLE.attachSchema(schemas.person);
DEBTS.attachSchema(schemas.debt);

DEBTS_SORT_MODIFIERS = { date: -1 };
PEOPLE_SORT_MODIFIERS = { last_name: 1 };

DEBTS.before.insert(function(_id, d){
    d.created_at = d.updated_at = Date.now();
});

DEBTS.before.update(function(_id, d){
    d.updated_at = Date.now();
});

PEOPLE.before.insert(function(_id, d){
    d.created_at = d.updated_at = Date.now();
});

PEOPLE.before.update(function(_id, d){
    d.updated_at = Date.now();
});
