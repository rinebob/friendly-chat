import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Course, Lesson } from 'src/app/common/interfaces';
import { COURSES, LESSONS } from 'src/app/common/mock-data';
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

    
    initialCourses = signal<Course[]>(COURSES);
    initialLessons = signal<Lesson[]>(LESSONS);

    courses$ = toObservable(this.friendlyChatStore.courseEntities);
    lessons$ = toObservable(this.friendlyChatStore.lessonEntities);

}
