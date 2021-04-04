import { ActivityService } from 'src/app/shared/activity.service';
import { FeedService } from 'src/app/feed/feed.service';
import { ScrollService } from './shared/scroll.service';
import { MiscellaneousService, PopUp } from './shared/miscellaneous.service';
import { WindowStateService } from './shared/window.service';
import { Component,  Inject,  OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { take, takeUntil,} from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { InfiniteScrollService } from './shared/infinite-scroll.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'snippet';

  windowSize: number;
  mobileCheck: boolean;
  tabletCheck: boolean;
  currentRoute: string;
  lastScroll: number;

  notifier$ = new Subject();

  popUpVal: Subject<PopUp>;
  modalState = new Subject<boolean>();

  isAuthenticated: boolean = false;
  myUid: string;
  myUid$ = new BehaviorSubject<string>(null); //From URL

  profileStickerEdit: boolean = false;
  showDashboard: boolean = false;

  preloadImages = ['/assets/images/Header%20Icons/createButtonActive.svg',
                   '/assets/images/Header%20Icons/createButtonInactive.svg',
                   '/assets/images/Header%20Icons/exploreActive.svg',
                   '/assets/images/Header%20Icons/exploreInactive.svg',
                   '/assets/images/Header%20Icons/optionsButtonActive.svg',
                   '/assets/images/Header%20Icons/optionsButtonInactive.svg',
                   '/assets/images/Header%20Icons/profileButtonActive.svg',
                   '/assets/images/Header%20Icons/profileButtonInactive.svg',
                   '/assets/images/Post/failSafeButton.png',
                   '/assets/images/Post/postdetailDropdown.svg',
                   '/assets/images/Profile%20Display/editModeBackground.svg',
                   '/assets/images/Profile%20Display/profileDescription.svg',
                   '/assets/images/Profile%20Display/profileDisplayBorder.svg',
                   '/assets/images/Profile%20Display/profileLinkEdit.svg',
                   '/assets/images/Profile%20Display/saveButton.svg',
                   '/assets/images/Create_page/createPlus.svg',
                   '/assets/images/nextArrow.svg',
                   '/assets/images/dpPlaceholder.svg'];

  constructor(private windowStateService: WindowStateService,
              private router: Router,
              private infiniteScrollService: InfiniteScrollService,
              private miscellaneousService: MiscellaneousService,
              private activityService: ActivityService,
              private feedService: FeedService,
              private scrollService: ScrollService,
              private auth: AngularFireAuth,
              @Inject(DOCUMENT) private _document ) {
    document.addEventListener("visibilitychange", function() { //mute posts on tab change
      feedService.mutePosts.next(!!document.hidden);
    });
  }

  ngOnInit() {
    this.feedService.getExplorePage().pipe(take(1)).subscribe(() => {return});
    this.activityService.collectionStartTime = new Date().getTime();
    this.activityService.holderListStartTime = new Date().getTime();
    this.miscellaneousService.preloadImages(this.preloadImages);

    this.windowStateService.checkWidth();
    this.windowStateService.setHeight();
    this.windowStateService.screenWidthValue.pipe(takeUntil(this.notifier$))
    .subscribe(val => {
      if (!val) return;
      val < 800 ? this.tabletCheck = true : this.tabletCheck = false;
      val < 550 ? this.mobileCheck = true : this.mobileCheck = false;
      if (!this.tabletCheck) this.miscellaneousService.showDashboard.next(false);
    });

    this.onResize();

    this.popUpVal = this.miscellaneousService.getPopUpSetUp();

    this.router.events.pipe(takeUntil(this.notifier$)).subscribe(val => {
      this.currentRoute = this.router.url;
      this.miscellaneousService.showDashboard.next(false);
      this.activityService.collectionStartTime = new Date().getTime();
      this.activityService.holderListStartTime = new Date().getTime();
      if (!this.currentRoute.includes('/auth')) this.miscellaneousService.lastRoute = this.currentRoute;
    });

    this.auth.onAuthStateChanged((user) => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.myUid = user.uid;
        this.myUid$.next(this.myUid);
      }
    });

    this.miscellaneousService.showDashboard.pipe(takeUntil(this.notifier$)).subscribe(value => {
      this.showDashboard = value;
      this.modalState.next(value);
      if (!value) this.miscellaneousService.userStickerSelection.next(null);
      this.feedService.mutePosts.next(value); //mute posts
    });

    this.miscellaneousService.profileStickerEdit.pipe(takeUntil(this.notifier$)).subscribe(value => this.profileStickerEdit = value);

    this.modalState.pipe(takeUntil(this.notifier$)).subscribe(state => {
      if (!state) {
        this._document.body.style.top = null;
        this._document.body.classList.remove('body-no-scroll');
        window.scroll(0, this.lastScroll);
      } else {
        this.lastScroll = window.scrollY;
        this._document.body.style.top = (-1 * this.lastScroll).toString() + 'px';
        this._document.body.classList.add('body-no-scroll');
      }
    });

    this.popUpVal.pipe(takeUntil(this.notifier$)).subscribe(value => this.modalState.next(!!value));
  }

  onResize(){
    this.windowStateService.checkWidth();
  }

  onWindowScroll($event){
    this.scrollService.setScroll();
  }

  toggleDashboard(event) {
    if (!this.tabletCheck || !this.showDashboard) return;
    this.miscellaneousService.showDashboard.next(false);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.notifier$.next();
    this.notifier$.complete();
    this.infiniteScrollService.getScroll$.complete();
  }
}
