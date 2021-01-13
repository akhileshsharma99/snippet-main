import { UsersService } from 'src/app/shared/users.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivityService } from '../shared/activity.service';
import { PostService } from '../shared/post.service';
import { takeUntil } from 'rxjs/operators';
import { StickerDetails } from '../shared/post.model';
import { Activity, Collection } from '../shared/activity.model';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ProfileDetails, ProfileSticker } from '../shared/profile.model';
import { MiscellaneousService, PopUp } from '../shared/miscellaneous.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-tab',
  templateUrl: './profile-tab.component.html',
  styleUrls: ['./profile-tab.component.css']
})
export class ProfileTabComponent implements OnInit {

  @Input() uid: string;
  @Input() pid: string;

  notifier$ = new Subject();
  profileDetails$: BehaviorSubject<ProfileDetails>;
  profileStickers: ProfileSticker[] = [null,null,null,null,null];
  stickerContent$: BehaviorSubject<any>;
  profileRoute: string;
  engagementProp = {'width': '0','background': '#E2B33D'};
  stickerDetails: StickerDetails;
  activity: Activity;
  engagementRatio: number = 0;
  myUid: string;
  isAuthenticated: boolean;
  postCollection: Collection[] = [];
  collectionLoaded = false;
  collectingSticker: boolean = false;
  profileStickersLoaded: boolean = false;

  constructor(private postService: PostService,
              private usersService: UsersService,
              private activityService: ActivityService,
              private authService: AuthService,
              private miscellaneousService: MiscellaneousService,
              private router: Router) { }

  ngOnInit(): void {

    if (!this.pid || !this.uid) return;

    this.authService.user.pipe(takeUntil(this.notifier$)).subscribe(response => {
      this.isAuthenticated = !!response;
      if (this.isAuthenticated) {
        this.myUid = response.id;
      }
    }, errorMessage => {
      console.log(errorMessage);
    });

    this.profileRoute = "/profile/" + this.uid;

    this.postService.getStickerDetails(this.pid).pipe(takeUntil(this.notifier$)).subscribe(response => {
      this.stickerDetails = response;
      this.setUpEngagement();
    });

    this.setUp();
    this.setUpActivity();
  }

  setUp() {
    this.profileStickersLoaded = false;
    this.profileDetails$ = this.usersService.getProfileDetails(this.uid);
    this.usersService.getProfileStickers(this.uid).pipe(takeUntil(this.notifier$)).subscribe(response => {
      if (!response) return;
      this.profileStickers = response;
      this.profileStickersLoaded = true;
    });;
    this.stickerContent$ = this.postService.getStickerContent(this.pid);
    // post collection list
    this.activityService.getPostCollection(this.pid).subscribe(response => {
      this.postCollection = response;
      this.collectionLoaded = true;
    });
  }

  setUpActivity() {
    this.activityService.getActivity(this.pid).pipe(takeUntil(this.notifier$)).subscribe(response => {
      this.activity = response[0];
      this.setUpEngagement();
    });
  }

  setUpEngagement(){
    if (this.stickerDetails && this.activity) {
      let colour: string;
      this.engagementRatio = this.activity.collected/this.stickerDetails.amountReleased;
      this.engagementRatio === 1 ? colour = '#13A032': colour = '#E3B33D';
      let percentage: string = (this.engagementRatio*100).toString() + '%';
      this.engagementProp.width = percentage;
      this.engagementProp.background = colour;
    }
  }



  collectSticker() {
    if (this.isAuthenticated) {
      if (!this.collectingSticker && this.collectionLoaded) {
        this.collectingSticker = true;
        let popUpObj: PopUp;
        let valid: boolean = false;

        for (let key in this.postCollection) {
          if (this.postCollection[key].collectorID === this.myUid) {
            valid = false;
            popUpObj = new PopUp("You already collected this sticker!",'Go to Collection','Stay Here', ['routing', 'default'],'collection/'+this.myUid);
            break;
          } else {
            valid = true;
          }
        }
        if (valid) {
          if (this.engagementRatio < 1) {
              this.activityService.addCollection(new Collection(this.myUid, this.uid, this.pid, new Date().getTime()));
              popUpObj = new PopUp("Sticker collected! Go to My Collection and select Edit to use your new Sticker",'Go to Edit','Stay Here', ['routing', 'default'], 'profile/'+this.myUid+'/edit');
          } else {
            popUpObj = new PopUp("There are no more stickers left!",'Okay', undefined, ['default', 'default']);
          }
        }

        this.miscellaneousService.setPopUp(popUpObj);
        this.collectingSticker = false;
      }
    } else {
      this.router.navigate(['/auth']);
    }
  }
}
