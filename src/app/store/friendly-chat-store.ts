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
    })),
    
    withMethods((store) => ({
        
        setAllCourses(courses: Course[]) {
            patchState(store, setAllEntities([...courses], {collection: 'course', idKey: 'id'}));
        },

        setSelectedCourseId(selectedCourseId: string) {
            patchState(store, {selectedCourseId});
        },

        setAllLessons(lessons: Lesson[]) {
            patchState(store, setAllEntities([...lessons], {collection: 'lesson', idKey: 'id'}));
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