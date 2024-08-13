import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FriendlyChatBaseComponent } from '../../friendly-chat-base/friendly-chat-base.component';
import { Course } from 'src/app/common/interfaces';
import { Timestamp } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ref, Storage } from '@angular/fire/storage';

@Component({
	selector: 'app-create-course',
	standalone: true,
	imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, AsyncPipe],
	templateUrl: './create-course.component.html',
	styleUrl: './create-course.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCourseComponent extends FriendlyChatBaseComponent {

	storage = inject(Storage);

	percentageChange$: Observable<number> = of(0);

	form = this.fb.group({
		description: ['', Validators.required],
		// url: ['', Validators.required],
		url: [''],
		category: [[], Validators.required],
		longDescription: ['', Validators.required],
		promo: [false],
		promoStartAt: [null],
		iconUrl: [''],
		seqNo: [''],
	});

	iconUrl = '';

	async uploadThumbnail(event: any) {
		console.log('cC uT upload thumbnail event: ', event);

		const file:File = event.target.files[0];
		console.log('cC uT file name: ', file.name);

		const docRef = await this.coursesService.getNewCourseDocRef();
		const courseId = docRef.id;

		const filePath = `courses/${courseId}/${file.name}`;

		const storageRef = ref(this.storage);

		const task = this.storage.upload(filePath, file, {
		cacheControl: 'max-age=2592000, public'
		});

		// this.percentageChanges$ = task.percentageChanges();

		// task.snapshotChanges().pipe(
		// 	last(),
		// 	concatMap(() => this.storage.ref(filePath).getDownloadURL()),
		// 	tap(url => {
		// 		console.log('cC uT icon url: ', url);
		// 		this.iconUrl = url;
		// 	}),
		// 	catchError(err => {
		// 		console.log('cC uT error: ', err);
		// 		alert('couldnt create the thumbnail url dude!  wtf???');
		// 		return throwError(err);
		// 	})

		// ).subscribe();
	}

	handleCreateCourse() {
		const hardCodedCourse: Partial<Course> = {
			description: "Yo this course was created again",
			longDescription: "its a new course dude",
			iconUrl: "https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-core-in-depth-small.png",
			lessonsCount: 10,
			categories: [
				"BEGINNER"
			],
			url: "angular-created-course",
			promo: false,
			price: 50
		}

		console.log('h cC create course: ', hardCodedCourse);

		const val = this.form.value;

		const categories: string[] = val.category ? [val.category] : []; 

		const newCourse: Partial<Course> = {
			id: '',
			description: val.description ?? '',
			url: val.url ?? '',
			longDescription: val.longDescription ?? '',
			promo: val.promo ?? false,
			categories,
			iconUrl: this.iconUrl,
			seqNo: Number(val.seqNo),

		}

		if (this.form.value.promoStartAt) {
			newCourse.promoStartAt = Timestamp.fromDate(this.form.value.promoStartAt);

		}
		console.log('cC hCC new course: ', newCourse);

		this.coursesService.createCourseWithSeqNo(hardCodedCourse);
	}



}
