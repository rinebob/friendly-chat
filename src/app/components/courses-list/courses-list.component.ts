import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { Course } from 'src/app/common/interfaces';
import { FriendlyChatBaseComponent } from '../friendly-chat-base/friendly-chat-base.component';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesListComponent extends FriendlyChatBaseComponent implements OnInit {

    courses = input.required<Course[]>();

    ngOnInit(): void {
        if (this.courses().length) {
            console.log('cL ngOI category: ', this.courses()[0].categories);
            console.log('cL ngOI input courses: ', this.courses());

        }

    }

    handleViewCourse(courseId: string) {
        this.friendlyChatStore.setSelectedCourseId(courseId);
        this.router.navigate(['/view-course', courseId])
    }

    handleEditCourse(course: Course) {
        console.log('cL hEC edit course: ', course);
    }

    handleDeleteCourse(course: Course) {
        console.log('cL hDC delete course: ', course);
    }
}
