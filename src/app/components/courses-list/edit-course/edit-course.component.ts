import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog'
import { Course } from 'src/app/common/interfaces';
import { FriendlyChatBaseComponent } from '../../friendly-chat-base/friendly-chat-base.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogContent, MatFormFieldModule, MatInputModule, MatSlideToggleModule, ReactiveFormsModule],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCourseComponent extends FriendlyChatBaseComponent {

    fb = inject(FormBuilder);

    dialogRef = inject(MatDialogRef<EditCourseComponent>);
    
    form: FormGroup;

    course: Course;

    constructor(@Inject(MAT_DIALOG_DATA) course: Course) {
        super();
        this.course = course;
        this.form = this.fb.group({
            description: [this.course.description, Validators.required],
            longDescription: [this.course.longDescription, Validators.required],
            promo: [this.course.promo],
        });
    }

    async handleSaveCourse() {
        const changes = {...this.form.value};
        // console.log('eC hSC handle save course: ', changes);
        await this.coursesService.updateCourse(this.course.id, changes).then((course) => {
            this.dialogRef.close(course);
        });
    }

    handleCloseDialog() {
        this.dialogRef.close();
    }


}
