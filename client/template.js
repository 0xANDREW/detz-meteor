FlashMessages.configure({
    autoHide: false
});

function get_attrs(tpl){
    var date = tpl.$('.date').val();

    return {
        _id: tpl.$('.debt-id').val(),
        attrs: {
            description: tpl.$('.description').val(),
            person_id: tpl.$('.person-id').val(),
            amount: tpl.$('.amount').val(),
            paid: tpl.$('.paid').prop('checked'),
            date: date.length ? date: null
        }
    };
}

function handle_err(err){
    FlashMessages.clear();

    if (err){
        FlashMessages.sendError(err.message);
    }
}

Template.debt_list.events({
    'click .new-debt': function(e){
        var t = Template.instance();

        Blaze.render(Template.debt_row, t.$('#debts')[0]);
    }
});

Template.debt_row.helpers({
    people_helper: function(){
        return PEOPLE.find();
    },

    pretty_date: function(date){
        if (date){
            return date.toString('yyyy-MM-dd');
        }
        
        return '';
    },

    money: function(amount){
        if (amount){
            return s.sprintf('%.02f', amount);
        }

        return '';
    }
});

Template.debt_row.events({
    'change input, change select': function(e){
        var a = get_attrs(Template.instance());

        if (a._id){
            DEBTS.update(a._id, { $set: a.attrs }, handle_err);
        }
        else {
            DEBTS.insert(a.attrs, handle_err);
        }
    },

    'click .copy': function(e){
        var a = get_attrs(Template.instance());

        if (a._id){
            DEBTS.insert(a.attrs, handle_err);
        }
    },

    'click .delete': function(e){
        var a = get_attrs(Template.instance());

        if (a._id){
            DEBTS.remove(a._id);
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
    }
});
