import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { Course } from 'src/app/common/interfaces';
import { FriendlyChatBaseComponent } from '../friendly-chat-base/friendly-chat-base.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterModule, NgOptimizedImage,
    MatButtonModule, MatCardModule, MatIconModule,
],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesListComponent extends FriendlyChatBaseComponent implements OnInit {

    dialog = inject(MatDialog);

    courses = input.required<Course[]>();
    coursesList$ = toObservable(this.courses);

    ngOnInit(): void {

        // this.coursesList$.pipe(skip(1)).subscribe(courses => {
        //     console.log('cL ngOI input courses$ sub: ', courses);
        //     console.log('cL ngOI category: ', this.courses()[0].categories);
        // });

        const lessons = this.coursesService.onReadCollectionGroup();

    }

    handleViewCourse(courseId: string) {
        this.friendlyChatStore.setSelectedCourseId(courseId);
        this.router.navigate(['/view-course', courseId])
    }

    handleEditCourse(course: Course) {
        console.log('cL hEC edit course: ', course);

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";

        dialogConfig.data = course;

        this.dialog.open(EditCourseComponent, dialogConfig)
            .afterClosed()
            .subscribe(val => {
                // if (val) {
                //     console.log('cL hEC course edited.  course: ', val);
                // }
            });
    }

    handleDeleteCourse(course: Course) {
        console.log('cL hDC delete course: ', course);
        this.coursesService.deleteCourseAndLessons(course.id);
    }
}
