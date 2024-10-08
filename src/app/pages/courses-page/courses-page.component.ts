import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { CoursesListComponent } from 'src/app/components/courses-list/courses-list.component';
import { FriendlyChatBaseComponent } from 'src/app/components/friendly-chat-base/friendly-chat-base.component';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule, MatIconModule, MatTabsModule, CoursesListComponent, RouterModule,
],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesPageComponent extends FriendlyChatBaseComponent implements OnInit {

    ngOnInit(): void {
        this.getAllCoursesListener();
    }
}
