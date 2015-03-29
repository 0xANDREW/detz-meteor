Router.configure({
    layoutTemplate: 'wrapper'
});

Router.route('/', {
    template: 'debt_list',
    
    data: function(){
        if (_.has(this.params.query, 'paid')){
            var sel = {};
        }
        else {
            sel = { paid: false };
        }
        
        var debts = DEBTS.find(sel, { sort: DEFAULT_SORT_MODIFIERS });

        return {
            total_owed: function(){
                var rv = 0;

                debts.forEach(function(d){
                    rv += d.amount;
                });

                return s.sprintf('$%.02f', rv);
            },
            
            debts: debts,
            show_paid: !_.has(sel, 'paid')
        };
    }
});

Router.route('/people', {
    template: 'person_list',
    
    data: function(){
        return { people: PEOPLE.find() };
    }
});
