define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils"

], function (cc, Backbone, Utils) {

    "use strict";

    var app = cc.app,
        Data = cc.module();

    Data.Models = {};

    Data.Collections = {};

    Data.Models.Base = Utils.Models.Validated.extend({

        /**
         * Id Attribute
         *
         * use a mongo-style _id
         *
         * @var string
         */
        idAttribute: '_id',

        monitor: function (related) {
            var that = this;
            related.bind('reset', function () {
                that.trigger('change');
            });
            related.bind('remove', function () {
                that.trigger('change');
            });
        }

    });

    Data.Collections.Base = Backbone.Collection.extend({

        locked: false,

        lock: function () {
            this.locked = true;
        },

        unlock: function () {
            this.locked = false;
        },

        refresh: function (opts) {
            var that = this;
            this.fetch({
                success: function (collection, response) {
                    if (opts.success) {
                        opts.success(collection, response);
                    }
                    that.unlock();
                },
                error: function (collection, response) {
                    if (opts.error) {
                        opts.error(collection, response);
                    }
                    that.unlock();
                }
            });

        },

        monitor: function (related) {
            var that = this;
            related.bind('reset', function () {
                that.trigger('change');
            });
            related.bind('remove', function () {
                that.trigger('change');
            });
        }

    });

    Data.Models.Transaction = Data.Models.Base.extend({

        /**
         * URL
         *
         * The model's url
         *
         * @return string
         */
        url: function () {
            var id = this.get('_id');
            return '/budgets/' + this.budget_id + '/lines/' + this.subline.get('_id') + '/transactions/' + (id || 'create');
        }

    });

    Data.Collections.Transaction = Data.Collections.Base.extend({

        model: Data.Models.Transaction,

        initialize: function (models, opts) {
            this.budget = opts.budget;
            this.line = opts.line;
            this.subline = opts.subline;
        },

        /**
         * URL
         *
         * corresponding API URL
         *
         * @return string
         */
        url: function () {
            var type = this.type || '';
            return '/budgets/' + this.budget.get('_id') + '/lines/' + this.line.get('_id') + '/sublines/' + this.subline.get('_id') + '/transactions';
        }

    });

    Data.Models.Subline = Data.Models.Base.extend({

        /**
         * Rules
         *
         * validation directives
         *
         * @var object
         */
        rules: {
            'line_number': 'required',
            'name': 'required',
            'subtotal': 'required',
            'parent_line_id': 'required'
        },

        initialize: function (opts) {
            var that = this;

            if (this.collection) {
                this.line = this.collection.line;
                this.budget = this.collection.budget;
            } else {
                this.line = opts.line;
                this.budget = this.line.budget;
            }

            if (!this.line) {
                console.log('SHIT! uninitialized parent opts:');
                console.log(opts);
                console.log(this);
                console.log(this.collection);
            }

            this.transactions = new Data.Collections.Transaction([], {
                budget: that.budget,
                line: that.line,
                subline: that
            });

            this.monitor(this.transactions);

            this.set({
                parent_line_id: that.line.get('_id')
            });
        },

        /**
         * URL
         *
         * corresponding API URL
         *
         * @return string
         */
        url: function () {
            var id = this.get('_id');
            return '/budgets/' + this.budget.get('_id') + '/lines/' + this.line.get('_id') + '/sublines/' + (id || 'create');
        }

    });

    Data.Collections.Subline = Data.Collections.Base.extend({

        model: Data.Models.Subline,

        /**
         * Initialize
         *
         * constructor
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (models, opts) {
            var that = this;

            this.budget = models.budget;
            this.line = models.line;

            _.each(models, function (model) {
                model.budget = that.budget;
                model.line = that.line;
            });
        },

        /**
         * URL
         *
         * corresponding API URL
         *
         * @return string
         */
        url: function () {
            var type = this.type || '';
            return '/budgets/' + this.budget.get('_id') + '/lines/' + this.line.get('_id') + '/sublines';
        }

    });

    /**
     * Line
     *
     * Line model. Attached to app
     */
    Data.Models.Line = Data.Models.Base.extend({

        /**
         * Rules
         *
         * Model validation rules
         *
         * @var object
         */
        rules: {
            'type': 'required',
            'line_number': 'required',
            'name': 'required',
            'subtotal': 'required'
        },

        /**
         * Initialize
         *
         * Setup a new model
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            var that = this;

            this.budget = app.current_budget;
            this.budget_id = this.budget.get('_id');

            this.sublines = new Data.Collections.Subline({
                budget: that.budget,
                line: that
            });

            this.monitor(this.sublines);
        },

        /**
         * Budget Total
         *
         * returns the budgeted amount for the line
         *
         * @return number
         */
        budget_total: function () {
            return parseFloat(this.get('subtotal'));
        },

        /**
         * Actual
         *
         * returns actual spending to date based on sublines
         *
         * @return number
         */
        actual: function () {
            return 0;
        },

        /**
         * URL
         *
         * The model's url
         *
         * @return string
         */
        url: function () {
            var id = this.get('_id');
            return '/budgets/' + this.budget_id + '/lines/' + (id || 'create');
        }

    });

    /**
     * Lines
     *
     * Lines collection
     */
    Data.Collections.Line = Data.Collections.Base.extend({

        /**
         * Model
         *
         * Defines the model this collection contains
         *
         * @var Model
         */
        model: Data.Models.Line,

        /**
         * Comparator
         *
         * Defines the ordering of this collection
         *
         * @param  Model  line
         * @return number
         */
        comparator: function (line) {
            return line.get("line_number");
        },

        /**
         * Initialize
         *
         * Setup the collection
         *
         * @param  array     models
         * @param  object    opts
         * @return undefined
         */
        initialize: function (models, opts) {
            this.type = opts.type;
            this.budget = opts.budget;
            this.budget_id = opts.budget.get('_id');
        },

        /**
         * Status
         *
         * returns "bad" if total is < actual, else returns "good"
         *
         * @return string
         */
        status: function () {
            var string = '',
                actual = this.actual(),
                budget = this.budget_total();
            if (actual !== budget) {
                string = (actual < budget) ? 'good' : 'bad';
            }
            return string;
        },

        /**
         * Budget
         *
         * Get the total of all lines in the collection
         *
         * @return number
         */
        budget_total: function () {
            return this.reduce(function (total, line) {
                return parseFloat(line.get('subtotal')) + total;
            }, 0);
        },

        /**
         * Actual
         *
         * Get the total of actuals in the collection
         *
         * @return number
         */
        actual: function () {
            return 0;
        },

        /**
         * URL
         *
         * The collection's associated URL
         *
         * @return string
         */
        url: function () {
            var type = this.type || '';
            return '/budgets/' + this.budget_id + '/lines/' + type;
        }

    });

    /**
     * Attachments Model
     *
     * model representing budget attachments
     */
    Data.Models.Attachment = Data.Models.Base.extend();

    /**
     * Collection
     *
     * Attachments collection
     */
    Data.Collections.Attachment = Data.Collections.Base.extend({

        /**
         * Model
         *
         * the model to be collected
         *
         * @var Model
         */
        model: Data.Models.Attachment,

        /**
         * Comparator
         *
         * defines the order of the collection
         * sorted by date modified
         *
         * @param  model  a
         * @param  model  b
         * @return number
         */
        comparator: function (a, b) {
            return b.get('_modified') - a.get('_modified');
        },

        /**
         * Initialize
         *
         * setup the collection
         *
         * @param  array     models
         * @param  object    opts
         * @return undefined
         */
        initialize: function (models, opts) {
            this.budget_id = opts.budget_id;
        },

        /**
         * URL
         *
         * Collection's associated URL
         *
         * @return string
         */
        url: function () {
            return '/budgets/' + this.budget_id + '/attachments';
        }

    });

    /**
     * Budget Model
     *
     * data model for representing budgets
     */
    Data.Models.Budget = Data.Models.Base.extend({

        /**
         * Id Attribute
         *
         * use mongo-style _id
         *
         * @var string
         */
        idAttribute: '_id',

        /**
         * Rules
         *
         * model validation rules
         *
         * @var object
         */
        rules: {
            'title': 'required',
            'description': 'required',
            'rolls': 'required',
            'starts': ['required', 'date'],
            'ends': ['required', 'date']
        },

        /**
         * Initialize
         *
         * setup the model
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {

            var that = this;

            this.incomes = new Data.Collections.Line([], {
                type: 'incomes',
                budget: that
            });
            this.expenses = new Data.Collections.Line([], {
                type: 'expenses',
                budget: that
            });

            this.bind('change:starts', function (model, value, opts) {
                that.parse_date('starts');
            });

            this.bind('change:ends', function (model, value, opts) {
                that.parse_date('ends');
            });

            this.monitor(this.incomes);
            this.monitor(this.expenses);

            this.refresh();

        },

        refresh: function (opts) {
            if (opts) {
                this.fetch(opts);
            }
            this.incomes.fetch();
            this.expenses.fetch();
        },

        /**
         * Status
         *
         * returns "bad" if excess is < 0, else returns "good"
         *
         * @return string
         */
        status: function () {
            var string = '',
                excess = this.excess();
            if (excess !== 0) {
                string = excess < 0 ? 'bad' : 'good';
            }
            return string;
        },

        /**
         * Budget Total
         *
         * calculates the budget from the budget's lines
         *
         * @return number
         */
        budget_total: function () {
            return this.incomes.budget_total() + this.expenses.budget_total();
        },

        /**
         * Actual
         *
         * calculates the actual value to date
         *
         * @return number
         */
        actual: function () {
            return 0;
        },

        /**
         * Excess
         *
         * calculates the budget's excess of income'
         *
         * @return number
         */
        excess: function () {
            return this.incomes.budget_total() - this.expenses.budget_total();
        },

        /**
         * Parse Date
         *
         * handles date conversions
         *
         * @return undefined
         */
        parse_date: function (key) {
            var value = this.get(key),
                s,
                date,
                parsed;

            if (typeof value === 'string') {
                s = value.split('-');
                // note to self... months are 0 -> 11 :(
                date = new Date(s[2], parseInt(s[1], 10) - 1, s[0]);
                parsed = {};
                parsed[key] = date.getTime();
                this.set(parsed, {silent: true});
            }
        },

        /**
         * URL
         *
         * model's associated URL
         *
         * @return string
         */
        url: function () {
            var id = this.get('_id');
            return '/budgets/' + (id || 'create');
        }

    });

    /**
     * Budget Collection
     *
     * backbone collection containing budget models
     */
    Data.Collections.Budget = Data.Collections.Base.extend({

        /**
         * Model
         *
         * model the collection contains
         *
         * @var Model
         */
        model: Data.Models.Budget,

        /**
         * URL
         *
         * Collection's associated URL
         *
         * @return string
         */
        url: function () {
            return '/budgets';
        }

    });

    return Data;

});