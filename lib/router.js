Router.configure({
    layoutTemplate: 'wrapper'
});

Router.route('/', {
    template: 'debt_list',
    
    data: function(){
        var debts = DEBTS.find({}, { sort: DEFAULT_SORT_MODIFIERS }); 

        return {
            total_owed: function(){
                var rv = 0;

                debts.forEach(function(d){
                    rv += d.amount;
                });

                return s.sprintf('$%.02f', rv);
            },
            
            debts: debts
        };
    }
});

Router.route('/people', {
    template: 'person_list',
    
    data: function(){
        return { people: PEOPLE.find() };
    }
});
