import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { Course } from 'src/app/common/interfaces';
import { FriendlyChatBaseComponent } from '../friendly-chat-base/friendly-chat-base.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditCourseComponent } from './edit-course/edit-course.component';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesListComponent extends FriendlyChatBaseComponent implements OnInit {

    dialog = inject(MatDialog);

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
