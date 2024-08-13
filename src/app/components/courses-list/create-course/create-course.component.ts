import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FriendlyChatBaseComponent } from '../../friendly-chat-base/friendly-chat-base.component';
import { Course } from 'src/app/common/interfaces';
import { Timestamp } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import { AsyncPipe, PercentPipe } from '@angular/common';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { FirestoreCollection } from 'src/app/common/constants';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
	selector: 'app-create-course',
	standalone: true,
	imports: [
        ReactiveFormsModule, 
        MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatSelectModule, MatSlideToggleModule,
        AsyncPipe, PercentPipe
    ],
	templateUrl: './create-course.component.html',
	styleUrl: './create-course.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCourseComponent extends FriendlyChatBaseComponent {

	// storage = inject(Storage);
    fb = inject(FormBuilder);

	percentageChange = signal<number>(0);
    imageUrl = signal<string>('')

    // id: string;
    // internalId:number;
    // description:string;
    // longDescription: string;
    // iconUrl: string;
    // lessonsCount?: number;
    // categories:string[];
    // seqNo: number;
    // url: string;
    // price: number;

    // courseListIcon?: string;
    // promo?: boolean;
    // createdAt?: Timestamp;
    // promoStartAt?: Timestamp;

	form = this.fb.group({
		description: ['', Validators.required],
		category: [[], Validators.required],
		longDescription: ['', Validators.required],
		promo: [false],
		promoStartAt: [null],
		iconUrl: [''],
		seqNo: [],
        url: [''],
        price: [],

        courseListIcon: [''],
        createdAt: '',
	});

	iconUrl = '';

	async uploadThumbnail(event: any) {
		console.log('cC uT upload thumbnail event: ', event);

		const file:File = event.target.files[0];
		console.log('cC uT file name: ', file.name);

		const docRef = await this.coursesService.createNewDocRef(FirestoreCollection.COURSES);
		const courseId = docRef.id;

		const filePath = `courses/${courseId}/${file.name}`;

		const storageRef = ref(this.storage, filePath);

		const uploadTask = uploadBytesResumable(storageRef, file, {
		    cacheControl: 'max-age=2592000, public'
		});

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.percentageChange.set(progress);
                console.log('cC uT upload is ' + progress + '% done');

                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log('cC uT upload thumbnail error: ', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    this.imageUrl.set(downloadURL);
                })
            })
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

		// console.log('h cC create course: ', hardCodedCourse);

		const val = this.form.value;

		const categories: string[] = val.category ? [val.category] : []; 

		const newCourse: Partial<Course> = {
			id: '',
			description: val.description ?? '',
			url: val.url ?? '',
			longDescription: val.longDescription ?? '',
			promo: val.promo ?? false,
			categories,
			iconUrl: this.imageUrl(),
			seqNo: Number(val.seqNo),
            createdAt: Timestamp.fromDate(new Date()),

		}

		if (this.form.value.promoStartAt) {
			newCourse.promoStartAt = Timestamp.fromDate(this.form.value.promoStartAt);

		}
		console.log('cC hCC new course: ', newCourse);

		this.coursesService.createCourseWithSeqNo(newCourse);
	}



}
