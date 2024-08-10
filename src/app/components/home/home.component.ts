import { JsonPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Course, Lesson } from 'src/app/common/interfaces';
import { COURSES, LESSONS } from 'src/app/common/mock-data';
import { FriendlyChatBaseComponent } from '../friendly-chat-base/friendly-chat-base.component';
import { skip } from 'rxjs';
import { compareFn } from 'src/app/utils/utils-fc';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends FriendlyChatBaseComponent implements OnInit {


    ngOnInit() {

        // const courses = Object.values(COURSES);
        // const lessons = Object.values(LESSONS);

        // console.log('h ngOI courses: ', courses)
        // console.log('h ngOI lessons: ', lessons)

        

        // for (const course of COURSES) {
        //     this.coursesService.createCourse(course);
        //     // this.coursesService.createCourseWithSeqNo(course);
        // }

        // for (const lesson of LESSONS) {
        //     this.coursesService.createLesson(lesson);
        // }

        // this.getAllCourses();
        // this.getAllLessons();

        this.getAllCoursesListener();
        // this.getAllLessonsListener();

        this.courses$.pipe(skip(1)).subscribe(courses => {
            console.log('h ngOI courses sub: ', courses);
            // if (!!courses && courses.length) {
            //     const courseIds = this.friendlyChatStore.courseIds() as string[];
            //     const index = Math.floor(Math.random() * courseIds.length - 1);
            //     const id = courseIds[index];
            //     console.log('h ngOI index/id from courseIds: ', index, id);
            //     this.getCourseById(id);
            // }
        });

        this.lessons$.pipe(skip(1)).subscribe(lessons => {
            // console.log('h ngOI lessons sub: ', lessons);
            // if (!!lessons && lessons.length) {
            //     const lessonIds = this.friendlyChatStore.lessonIds() as string[];
            //     const index = Math.floor(Math.random() * lessonIds.length - 1);
            //     const id = lessonIds[index];
            //     // console.log('h ngOI index/id from lessonIds: ', index, id);
            //     // this.getLessonById(id);

            // }
        });
    }

    enumerateCourses() {
        let lessonsSource = [...LESSONS];
        const courses = this.friendlyChatStore.courseEntities().sort(compareFn)
        for (const course of courses) {
            console.log(`-------------- COURSE ${course.internalId} -------------`)
            console.log('name: ', course.description)
            const lessons = this.friendlyChatStore.lessonEntities().filter(lesson => lesson.courseId === course.internalId);
            for (const lesson of lessons) {
                console.log('lesson internalId/name: ', lesson.courseId, lesson.internalId, lesson.description);
                
            }
            const remaininglessons = lessonsSource.filter(lesson => lesson.courseId !== course.internalId);
            lessonsSource = [...remaininglessons];
        }

        console.log(`-------------- REMAINING LESSONS -------------`);
        for (const lesson of lessonsSource) {
            console.log('id/name/course id: ', lesson.internalId, lesson.description, lesson.courseId)
        }
    }

    async initializeFirestoreEmulatorDb() {
        console.log(`-------------- INIT EMULATOR DB -------------`);
        // const courses = Object.values(COURSES);
        // const lessons = Object.values(LESSONS);

        // console.log('h ngOI courses: ', courses)
        // console.log('h ngOI lessons: ', lessons)

        for (const course of COURSES) {
            console.log(`-------------- COURSE ${course.internalId} -------------`)
            const id = await this.coursesService.createCourse(course);
            console.log('new course id: ', id);
            const lessons = LESSONS.filter(lesson => lesson.courseId === course.internalId);
            for (const lesson of lessons) {
                console.log('lesson id: ', lesson.internalId);
                this.coursesService.createLesson(id, lesson);
            }
        }
        console.log(`-------------- STORE RESULTS -------------`);
        const courses = this.friendlyChatStore.courseEntities();
        for (const course of courses) {
            console.log('course id/course: ', course.internalId, course.id, course)

        }
    }

    async getAllCourses() {
        const courses = await this.coursesService.getAllCourses();
        this.friendlyChatStore.setAllCourses([...courses]);
        // console.log('h gAC store courses: ', this.friendlyChatStore.courseEntities());
        // console.log('h gAC store course ids: ', this.friendlyChatStore.courseIds());
        // console.log('h gAC store courseEntityMap: ', this.friendlyChatStore.courseEntityMap());
    }

    // async getAllCoursesListener() {
    //     await this.coursesService.getAllCoursesListener()
    // }

    async getCourseById(id: string) {
        const course = await this.coursesService.getCourseById(id);
        console.log('h gCBI course for id: ', id, course);
        this.friendlyChatStore.setSelectedCourseId(id);
    }

    async getAllLessons() {
        const lessons = await this.coursesService.getAllLessons();
        this.friendlyChatStore.setAllLessons([...lessons]);
        // console.log('h gAC store lessons: ', this.friendlyChatStore.lessonEntities());
        console.log('h gAC store lesson ids: ', this.friendlyChatStore.lessonIds());
        console.log('h gAC store lessonEntityMap: ', this.friendlyChatStore.lessonEntityMap());
    }

    // async getAllLessonsListener() {
    //     await this.coursesService.getAllLessonsListener();
    // }

    async getLessonById(id: string) {
        const lesson = await this.coursesService.getLessonById(id);
        // console.log('h gCBI lesson for id: ', id, lesson);
        this.friendlyChatStore.setSelectedLessonId(id);
    }

    getLessonsForCourse(courseId: number) {
        const lessonsForCourse = this.friendlyChatStore.lessonEntities().filter(lesson => lesson.courseId === courseId);
        // console.log('h gLFC get lessons for course: ', courseId);
        return lessonsForCourse;
    }

    createCourse() {
        const newCourse: Partial<Course> = {
            internalId: 101,
            description: "Round 3 of our journey dude",
            longDescription: "its a new course dude",
            iconUrl: "https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-core-in-depth-small.png",
            lessonsCount: 10,
            categories: [
                "BEGINNER"
            ],
            url: "angular-dude-course",
            promo: false,
            price: 50
        }

        console.log('h cC create course: ', newCourse);

        this.coursesService.createCourseWithSeqNo(newCourse);
    }

    async updateCourse(id: string, changes: Partial<Course>) {
        console.log('h UC update course: ', changes);
        this.coursesService.updateCourse(id, changes);
    }

    // Note: this will not delete any associated lessons
    async deleteCourse(id: string) {

    }

    deleteCourseAndLessons(courseId: string) {
        const course = this.friendlyChatStore.courseEntities().find(entity => entity.id === courseId);
        console.log('h dCAL course interal id/name: ', course?.id, course?.description);
        this.coursesService.deleteCourseAndLessons(courseId);
    }

    handleCreateCourse() {
        this.createCourse();
    }

    handleEditCourse(course: Course) {
        course.description = course.description + ' DUDE ITS EDITED'
        console.log('h hEC handle edit course: ', course);
        this.updateCourse(course.id, course);
    }
    
    handleDeleteCourseAndLessons(courseId: string) {
        console.log('h hEC handle delete course and lessons for course id: ', courseId);
        this.deleteCourseAndLessons(courseId);

    }
}