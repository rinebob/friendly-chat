import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesPageComponent {

}
