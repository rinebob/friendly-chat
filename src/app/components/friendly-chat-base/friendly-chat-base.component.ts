import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Course, Lesson } from 'src/app/common/interfaces';
import { COURSES, LESSONS } from 'src/app/common/mock-data';
import { AuthService } from 'src/app/services/auth.service';
import { CoursesService } from 'src/app/services/courses.service';
import { FriendlyChatStore } from 'src/app/store/friendly-chat-store';

@Component({
  selector: 'app-friendly-chat-base',
  standalone: true,
  imports: [],
  template: ``,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendlyChatBaseComponent {

    friendlyChatStore = inject(FriendlyChatStore);
    coursesService = inject(CoursesService);
    authService = inject(AuthService);

    user$: Observable<User | null> = this.authService.user$;
    
    initialCourses = signal<Course[]>(COURSES);
    initialLessons = signal<Lesson[]>(LESSONS);

    courses$ = toObservable(this.friendlyChatStore.courseEntities);
    lessons$ = toObservable(this.friendlyChatStore.lessonEntities);

    constructor() {
        effect(() => {
            this.effect();
        });
    }

    effect() {
        console.log('fCB eff courses: ', this.friendlyChatStore.courseEntities())
        console.log('fCB eff beg courses: ', this.friendlyChatStore.beginnerCourses())
        console.log('fCB eff adv courses: ', this.friendlyChatStore.advancedCourses())
    }

    async getAllCoursesListener() {
        await this.coursesService.getAllCoursesListener()
    }

}
