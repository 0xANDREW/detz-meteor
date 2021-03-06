Template.registerHelper('pretty_date', function(date){
    return date.toString('yyyy-MM-dd');
});

Template.registerHelper('money', function(amount){
    return s.sprintf('%.02f', amount);
});

FlashMessages.configure({
    autoHide: false
});

function get_debt_attrs(tpl){
    var date = tpl.$('.date').val();

    return {
        _id: tpl.$('.debt-id').val(),
        attrs: {
            description: tpl.$('.description').val(),
            person_id: tpl.$('.person-id').val(),
            amount: tpl.$('.amount').val(),
            paid: tpl.$('.paid').prop('checked'),
            payment: tpl.$('.payment').prop('checked'),
            date: date.length ? date: null
        }
    };
}

function get_person_attrs(tpl){
    return {
        _id: tpl.$('.person-id').val(),
        attrs: {
            last_name: tpl.$('.last-name').val(),
            first_name: tpl.$('.first-name').val()
        }
    };
}

function handle_err(err){
    FlashMessages.clear();

    if (err){
        FlashMessages.sendError(err.message);
    }
}

Template.person_list.events({
    'click .new-person': function(e){
        var t = Template.instance();

        Blaze.renderWithData(Template.person_row, {
            total: 0
        }, t.$('#people')[0]);
    }
});

Template.debt_list.events({
    'click .new-debt': function(e){
        var t = Template.instance();

        Blaze.renderWithData(Template.debt_row, {
            amount: 0,
            date: new Date()
        }, t.$('#debts')[0]);
    }
});

Template.debt_row.helpers({
    people_helper: function(){
        return PEOPLE.find();
    }
});

Template.debt_row.events({
    'change input, change select': function(e){
        var tpl = Template.instance();
        var a = get_debt_attrs(tpl);

        if (a._id){
            DEBTS.update(a._id, { $set: a.attrs }, handle_err);
        }
        else {
            DEBTS.insert(a.attrs, function(err, _id){
                handle_err(err);

                // (HACK) Remove all view elements from DOM
                // TODO: this is likely because I don't know how to
                // properly add dynamic rows
                if (_id){
                    tpl.$('*').remove();
                }
            });
        }
    },

    'click .copy': function(e){
        var a = get_debt_attrs(Template.instance());

        if (a._id){
            DEBTS.insert(a.attrs, handle_err);
        }
    },

    'click .delete': function(e){
        var a = get_debt_attrs(Template.instance());

        if (a._id && window.confirm('Delete?')){
            DEBTS.remove(a._id);
        }
        else {
            Template.instance().$('*').remove();
        }
    }
});

Template.person_row.events({
    'change input': function(e){
        var tpl = Template.instance();
        var a = get_person_attrs(tpl);

        if (a._id){
            PEOPLE.update(a._id, { $set: a.attrs }, handle_err);
        }
        else {
            PEOPLE.insert(a.attrs, function(err, _id){
                handle_err(err);

                // (HACK) Remove all view elements from DOM
                // TODO: this is likely because I don't know how to
                // properly add dynamic rows
                if (_id){
                    tpl.$('*').remove();
                }
            });
        }
    },

    'click .delete': function(e){
        var a = get_person_attrs(Template.instance());

        if (a._id && window.confirm('Delete?')){
            PEOPLE.remove(a._id);
        }
    }
});

Template.debt_row.onRendered(function(){
    this.$('.datepicker').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    if (this.data){
        this.$('.person-id').val(this.data.person_id);
        this.$('.paid').prop('checked', this.data.paid);
        this.$('.payment').prop('checked', this.data.payment);

        if (this.data.payment){
            this.$('.row').addClass('bg-warning');
        }
    }
});
