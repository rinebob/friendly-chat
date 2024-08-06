import { JsonPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Course, Lesson } from 'src/app/common/interfaces';
import { COURSES, LESSONS } from 'src/app/common/mock-data';
import { FriendlyChatBaseComponent } from '../friendly-chat-base/friendly-chat-base.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends FriendlyChatBaseComponent implements OnInit {


    ngOnInit() {

        // const courses = Object.values(AU_COURSES);
        // const lessons = Object.values(AU_LESSONS);

        // console.log('h ngOI courses: ', courses)
        // console.log('h ngOI lessons: ', lessons)

        

        // for (const course of COURSES) {
        //     this.coursesService.createCourse(course);
        //     // this.coursesService.createCourseWithSeqNo(course);
        // }

        // for (const lesson of LESSONS) {
        //     this.coursesService.createLesson(lesson);
        // }

        

    }

    async getAllCourses() {
        const courses = await this.coursesService.getAllCourses();
        // this.courses.set(courses);
    }

    getLessonsForCourse(courseId: number) {
        const lessonsForCourse = LESSONS.filter(lesson => lesson.courseId === courseId);
        // console.log('h gLFC get lessons for course: ', courseId)
        return lessonsForCourse;
    }

    createCourse() {
        const newCourse: Partial<Course> = {
            id: 100,
            description: "New course dude",
            longDescription: "its a new course dude",
            iconUrl: "https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-core-in-depth-small.png",
            lessonsCount: 10,
            categories: [
                "BEGINNER"
            ],
            url: "angular-dude-course",
            price: 50
        }

        this.coursesService.createCourseWithSeqNo(newCourse);
    }
}
