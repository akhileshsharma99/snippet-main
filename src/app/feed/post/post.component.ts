import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { Subject, Subscription, Observable, BehaviorSubject } from 'rxjs';
import { ProfileDetails, ProfileSticker} from './../../shared/profile.model';
import { PostService } from './../../shared/post.service';
import { StickerDetails, PostDetails } from './../../shared/post.model';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ElementRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UsersService } from 'src/app/shared/users.service';
import { ActivityService } from 'src/app/shared/activity.service';
import { Activity } from 'src/app/shared/activity.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
  export class PostComponent implements OnInit, OnDestroy {

  @Input() postDetails: PostDetails;
  @Input() createPost?: boolean = false;
  @Input() pid?: string;
  @Input() postContent$?: BehaviorSubject<any>;
  @Input() stickerContent$?: BehaviorSubject<any>;

  @Output() addClick = new EventEmitter();

  profileDetails$?: Observable<ProfileDetails>;
  profileStickers$?: Observable<ProfileSticker[]>;
  notifier$ = new Subject();

  stickerDetails: StickerDetails;
  activity: Activity;

  addIcon = "assets/icons/add_icon@2x.png"

  imageProp = {'height':'auto', 'width':'auto'};
  stickerProp = {'height':'auto', 'width':'auto'};
  engagementProp = {'width': '0','background': '#D8B869'};

  viewed: boolean = false;
  collectingSticker: boolean = false;
  showDetails = false;
  showComments = false;
  holderToggle = false;
  collected: string = '0';
  views: string = '0';
  uid: string;
  myUid: string;
  isAuthenticated: boolean;
  profileRoute: string;
  engagementRatio: number = 0;

  userSubs: Subscription;

  constructor(private postService: PostService,
              private authService: AuthService,
              private usersService: UsersService,
              private activityService: ActivityService,
              private router: Router) { }

  ngOnInit(): void {
    this.restartPost();
  }

  restartPost() {
    this.userSubs = this.authService.user.subscribe(response => {
      this.isAuthenticated = !!response;
      if (this.isAuthenticated) {
        this.myUid = response.id;
      }
    }, errorMessage => {
      console.log(errorMessage);
    });

    this.uid = this.postDetails.uid;
    this.setUpProfile();

    if (!this.createPost) {
      this.setUpPost();
      this.setUpActivity();
      this.setUpEngagement();
     }
  }

  setUpPost() {
    this.postContent$ = this.postService.getPostContent(this.pid);
    this.stickerContent$ = this.postService.getStickerContent(this.pid);
    this.postService.getStickerDetails(this.pid).pipe(takeUntil(this.notifier$)).subscribe(response => {
      this.stickerDetails = response;
      this.setUpEngagement();
    });
  }

  setUpProfile() {
    this.profileDetails$ = this.usersService.getProfileDetails(this.uid);
    this.profileStickers$ = this.usersService.getProfileStickers(this.uid);
  }

  setUpActivity() {
    this.activityService.getActivity(this.uid).pipe(takeUntil(this.notifier$)).subscribe(response => {
      this.activity = response[0];
      this.setUpEngagement();
      if (this.engagementRatio) {
        this.views = this.convertToShort(this.activity.views);
        this.collected = this.convertToShort(this.activity.collected);
      }

    });;
  }

  getEmptySlots(stickers) {
    console.log(stickers); //log
    return [...Array(5-stickers.length).keys()]; 
  }

  setUpEngagement(){
    if (this.stickerDetails && this.activity) {
      let colour: string;
      this.engagementRatio = this.activity.collected/this.stickerDetails.amountReleased;
      this.engagementRatio === 1 ? colour = '#53BD9C': colour = '#D8B869';
      let percentage: string = (this.engagementRatio*100).toString() + '%';
      this.engagementProp.width = percentage;
      this.engagementProp.background = colour;
    }
  }

  getDetailsButton() {
    let close = "https://i.ibb.co/ZmbVSG4/Post-Detail-Button-3x.png";
    let open = "https://i.ibb.co/p1fcnfh/Post-Detail-Button-open-3x.png"
    return this.showDetails === false ?  close : open;
  }

  onLoad(event: any) {
    let width = event.target.width;
    let height= event.target.height;
    if (width/height > 1) {
      this.imageProp.width = 'auto';
      this.imageProp.height = '100%';
    }
    else if (width/height <= 1 && width/height < 475/580) {
      this.imageProp.width = '100%';
      this.imageProp.height = 'auto';
    } else {
      this.imageProp.width = 'auto';
      this.imageProp.height = '580px';
    }

  }

  onStickerLoad(event: any) {
    let width = event.target.width;
    let height= event.target.height;
    if (width/height < 1) {
      this.stickerProp.width = '100%';
      this.stickerProp.height = 'auto';
    } else {
      this.stickerProp.width = 'auto';
      this.stickerProp.height = '100%';
    }
  }

  convertToShort(num: number): string {
    let short = 0;
    if (num/1000000 <= 1) {
      if (num/1000 <= 1) {
          return num.toString();
      } else {
        short = Math.round((num/1000) * 10) / 10;
        return short.toString() + 'K';
      }
    } else {
      short = Math.round((num/1000000) * 100) / 100;
      return short.toString() + 'M';
      }
  }

  onAddClick(field: string) {
    this.addClick.emit(field);
  }

  postView() {
    if (!this.viewed && !this.createPost) {
      this.viewed = true;
      this.activityService.addViews(this.pid,this.myUid,this.uid);
    }
  }

  collectSticker() {
    if (this.isAuthenticated) {
      if (!this.collectingSticker && !this.createPost) {
        this.collectingSticker = true;
        this.activityService.getPostCollection(this.pid).subscribe(response => {
          let valid: boolean = false;
          for (let key in response) {
            if (response[key].collectorID === this.myUid) {
              valid = false;
              alert("You already collected this sticker!");
              break;
            } else {
              valid = true;
            }
          }
          if (valid) {
            if (this.engagementRatio < 1) {
                this.activityService.addCollection(this.pid,this.myUid,this.uid);
                alert("Sticker collected! Go to My Collection and select Edit to use your new Sticker");
            } else {
              alert("No more Stickers left!");
            }
          }
          this.collectingSticker = false;
        });
      }
    } else {
      this.router.navigate(['/auth']);
    }
  }

  ngOnDestroy() {
    this.notifier$.next();
    this.notifier$.complete();
  }
}
