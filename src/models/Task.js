import { Goal } from "./Goal";
export class Task {
    constructor(
        id = null,
        goal = new Goal(),
        text = '',
        completed = false
    ) {
        this.id = id;
        this.goal = goal;
        this.text = text;
        this.completed = completed;
    }
}
