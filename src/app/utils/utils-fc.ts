import { Course, CourseOrLesson, Lesson } from "../common/interfaces";

export function compareFn(a: CourseOrLesson, b: CourseOrLesson) {
    if (a.internalId - b.internalId > 0) {
        return 1;
    } else if (a.internalId - b.internalId < 0) {
        return -1;
    } else {
        return 0
    }
}