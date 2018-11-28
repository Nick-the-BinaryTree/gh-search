import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, from } from 'rxjs';
import { concatMap, debounceTime, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('search_box') searchBox: ElementRef;

  title = 'gh-search';
  userTypesInSearchBox;

  avatar_url: String | null;
  html_url: String | null;
  login: String | null;
  should_display: boolean = false;

  ngAfterViewInit() {
    this.userTypesInSearchBox = fromEvent(
      this.searchBox.nativeElement, 'keyup'
    ).pipe(
      map(() => this.searchBox.nativeElement.value),
      debounceTime(200),
      filter((searchTerm: string) => searchTerm.length > 0),
      concatMap((searchTerm: string) => from(
        fetch('https://api.github.com/users/' + searchTerm)
      ))
    ).subscribe(async (response: any) => {
      const data = await response.json();
      console.log(data);

      this.updatePage(
        data.avatar_url,
        data.html_url,
        data.login
      );
    });
  }

  updatePage(avatar_url, html_url, login) {
    this.avatar_url = avatar_url;
    this.html_url = html_url;
    this.login = login;
    this.should_display = true;
  }
}
