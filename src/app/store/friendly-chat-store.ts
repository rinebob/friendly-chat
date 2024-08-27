import { getState, patchState, signalStore, type, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { removeAllEntities, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { Course, Lesson } from "../common/interfaces";
import { computed, effect } from "@angular/core";

export type FriendlyChatState = {
    selectedCourseId: string,
    selectedLessonId: string,
}

const initialState: FriendlyChatState = {
    selectedCourseId: '',
    selectedLessonId: '',
}


export const FriendlyChatStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withEntities({ entity: type<Course>(), collection: 'course' }),
    withEntities({ entity: type<Lesson>(), collection: 'lesson' }),
    
    withComputed((state) => ({
        beginnerCourses: computed(() => {
            const courses = state.courseEntities();
            const beginnerCourses = courses.filter(course => course.categories.includes('BEGINNER'))
            return beginnerCourses;
        }),
        
        advancedCourses: computed(() => {
            const courses = state.courseEntities();
            const advancedCourses = courses.filter(course => course.categories.includes('ADVANCED'))
            return advancedCourses;
        }),

        selectedCourseWithLessons: computed(() => {
            const courses = state.courseEntities();
            const lessons = state.lessonEntities();
            const selectedCourseId = state.selectedCourseId();
            const selectedCourse = courses.find(course => course.id === selectedCourseId);
            const lessonsForCourse = lessons.filter(lesson => lesson.courseId === selectedCourse?.internalId);
            return {selectedCourse, lessonsForCourse};
        }),
    })),
    
    withMethods((store) => ({
        
        setAllCourses(courses: Course[]) {
            // patchState(store, setAllEntities([...courses], {collection: 'course', idKey: 'id'}));
            patchState(store, setAllEntities([...courses], {collection: 'course'}));
        },

        setSelectedCourseId(selectedCourseId: string) {
            patchState(store, {selectedCourseId});
        },

        setAllLessons(lessons: Lesson[]) {
            patchState(store, setAllEntities([...lessons], {collection: 'lesson'}));
        },

        setSelectedLessonId(selectedLessonId: string) {
            patchState(store, {selectedLessonId});
        },

        getCoursesByKeyword(keyword: string) {
            const courses = store.courseEntities();
            const filteredCourses = courses.filter(course => course.categories.includes(keyword));
            return filteredCourses;
        }

    })),

    withHooks({
        // onInit(store) {
        //     effect(() => {
        //         const state = getState(store);
        //         console.log('fCSto oI friendly chat state eff: ', state);
        //     });
        // }
    }),

);