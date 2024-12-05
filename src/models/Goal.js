export class Goal {
    constructor(
        id = null,
        user = {},
        category = 'Self Growth',
        title = '',
        description = '',
        completed = false,
        start_date = '',
        times_per_day = 1,
        days_per_week = 1,
        duration = 1,
        duration_unit = 'weeks',
        completed_on = ''
    ) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.start_date = start_date;
        this.times_per_day = times_per_day;
        this.days_per_week = days_per_week;
        this.duration = duration;
        this.duration_unit = duration_unit;
        this.completed_on = completed_on;
    }
}
