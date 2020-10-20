import { Posts, StickerContent } from './../../shared/post.model';
import { PostService } from './../../shared/post.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ProfileDetails, PersonalDetails, Biography, ProfileSticker, DisplayPicture } from './../../shared/profile.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Post, PostDetails } from 'src/app/shared/post.model';
import { Profile } from 'src/app/shared/profile.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit, OnDestroy {

  // @ViewChild('dpInput') dpInput: ElementRef<HTMLElement>;


  // dpUpload: any;
  // touched = false;

  // dpSrc: string = "/assets/default image/080708 background.png";
  // addIcon = "assets/icons/add_icon@2x.png"

  // imageProp = {'height':'100%', 'width':'auto'};

  // collectionList: {posts: Posts, dateCollected: Date ,colour: string}[] = [];
  // oldPsid: string[] = [];
  // profile: Profile = new Profile(new ProfileDetails('', new Biography('',null,null)), [],new PersonalDetails(null,null,null,null), new DisplayPicture('69',this.dpSrc));
  // isFetching = true;
  // isFetchingCollection: boolean = true;
  // isSaving = false;
  // uid: string;
  // title: string;
  // location: string;
  // content: string;
  // username: string;
  // error: string = null;
  // lastTitle: string;
  // lastLocation: string;
  // lastContent: string;
  // stickerClickTimer: boolean = true;

  // changedDP: boolean = false;
  // changedProfileStickers: boolean = false;
  // changedBio: boolean = false;

  // subProfileStickers: Subscription;
  // subProfileDetails: Subscription;
  // subPostDetails: Subscription;
  // subStickerContent: Subscription;
  // subDisplayPicture: Subscription;

  // stickerDelete = new Subject<number>();


  // constructor(private profileService: ProfileService,
  //             private profileDataService: ProfileDataService,
  //             private postService: PostService,
  //             private postDataService: PostDataService,
  //             private route: ActivatedRoute,
  //             private router: Router) { }

  ngOnInit(): void {

  //   this.isFetching = true;

  //   this.route.params
  //   .subscribe(
  //     (params: Params) => {
  //       this.uid = params['id'];
  //       this.setUpProfileDetails();
  //       this.setUpProfileStickers();
  //       this.setUpDP();
  //       this.getCollectionList();
  //     }, errorMessage => {
  //       console.log(errorMessage);
  //       this.handleError();
  //     });
  }

  // setUpProfileDetails() {
  //   this.isFetching = true;

  //   this.subProfileDetails = this.profileService.getProfileDetails(this.uid).subscribe(response => {
  //     if (response) {
  //       this.profile.profileDetails = response;
  //       this.isFetching = false;
  //       this.title = this.profile.profileDetails.bio.title;
  //       this.location = this.profile.profileDetails.bio.location;
  //       this.content = this.profile.profileDetails.bio.content;
  //       this.lastTitle = this.profile.profileDetails.bio.title.slice();
  //       this.lastLocation = this.profile.profileDetails.bio.location.slice();
  //       this.lastContent = this.profile.profileDetails.bio.content.slice();
  //       this.username = this.profile.profileDetails.username;
  //     }
  //   },
  //   errorMessage => {
  //     console.log(errorMessage);
  //     this.handleError();
  //   });

  // }

  // setUpProfileStickers() {

  //   this.subProfileStickers = this.profileService.getProfileStickers(this.uid).subscribe(response => {
  //     if (response) {
  //       this.profile.profileStickers = response;
  //     }
  //   },
  //   errorMessage => {
  //     console.log(errorMessage);
  //     this.handleError();
  //   });

  // }

  // setUpDP() {
  //   this.subDisplayPicture = this.profileService.getDisplayPicture(this.uid).subscribe(response => {
  //     if (response) {
  //       this.profile.displayPicture = response;
  //     }
  //   },
  //   errorMessage => {
  //     console.log(errorMessage);
  //     this.handleError();
  //   });
  // }

  // getCollectionList() {

  //   this.isFetchingCollection = true;

  //   this.postDataService.fetchSCL('uid',this.uid).pipe( map( stickerCollector => {
  //     let dataArray = [];
  //     for (let key in stickerCollector) {
  //       dataArray.push(stickerCollector[key]);
  //     }
  //     return dataArray;
  //   })).subscribe(sclVal => {
  //     sclVal.forEach(collector => {
  //       let pid = collector.pid;
  //       let dateCollected = collector.dateCreated;
  //       this.setUpPostDetails(pid, dateCollected)
  //     });
  //     this.isFetchingCollection = false;
  //   }, errorMessage => {
  //     console.log(errorMessage);
  //     this.handleError();
  //   });
  // }

  // setUpPostDetails(pid: string, dateCollected: Date) {

  //  this.subPostDetails = this.postService.getPostDetails(pid).pipe(take(2)).subscribe( data => {
  //    if (data) {
  //     let tempPostDetails: PostDetails;
  //     tempPostDetails = data;

  //     let tempPosts = new Posts(pid, new Post(tempPostDetails));

  //     let index = this.profile.profileStickers.findIndex(sticker => {
  //       return sticker.pid === pid;
  //     });

  //     if (index != -1) {
  //       let collection = { posts: tempPosts, dateCollected: new Date(), colour: '#53BD9C'};
  //       this.collectionList.push(collection);
  //     } else {
  //       let collection = { posts: tempPosts, dateCollected: dateCollected, colour: 'transparent'};
  //       this.collectionList.push(collection);
  //     }

  //     this.collectionList.sort((a, b) => new Date(b.dateCollected).getTime() - new Date(a.dateCollected).getTime());

  //     this.setUpStickerContent(pid);
  //    }
  //     }, errorMessage => {
  //       console.log(errorMessage);
  //       this.handleError();
  //   });
  // }

  // setUpStickerContent(pid:string) {

  //   this.subStickerContent = this.postService.getStickerContent(pid).subscribe(response => {
  //     if (response) {
  //       this.collectionList.find(collection => {
  //         return collection.posts.pid === pid;
  //       })
  //       .posts.post.stickerContent = response;
  //     }
  //   },
  //   errorMessage => {
  //     console.log(errorMessage);
  //   });

  // }

  // onStickerClick(option: {posts: Posts, dateCreated:Date, colour: string}) {
  //   if (option.posts.post.postDetails) {
  //     this.changedProfileStickers = true;
  //     let pid = option.posts.pid;
  //     let index = this.profile.profileStickers.stickers.findIndex(sticker => {
  //       return sticker.pid === pid;
  //     });
  //     if (index != -1) {
  //       this.profile.profileStickers.stickers.splice(index,1);
  //       option.colour = 'transparent';
  //     } else if (index === -1 && this.profile.profileStickers.stickers.length < 5) {
  //       this.profile.profileStickers.stickers.push(new ProfileSticker('69',pid, new Date()));
  //       option.colour = '#53BD9C';
  //     };
  //   }
  // }

  // fileUpload(event) {
  //   if (event.target.files)  {
  //     var reader = new FileReader();

  //     let file = event.target.files[0];
  //     reader.readAsDataURL(file);

  //     reader.onload = (event:any) => {
  //       if (file.size < 4*1024*1024) { //Firebase upload max size 10 MB
  //         this.error = null;
  //         this.profile.displayPicture.content = event.target.result;
  //       } else {
  //         this.error ='Post file size too big! There is a 4 MB limit';
  //       }
  //     }
  //   }
  // }

  // onLoad(event: any) {
  //   let width = event.target.width;
  //   let height= event.target.height;
  //   if (width/height < 1) {
  //     this.imageProp.width = '100%';
  //     this.imageProp.height = 'auto';
  //   } else {
  //     this.imageProp.width = 'auto';
  //     this.imageProp.height = '100%';
  //   }
  // }

  // setUpStickerSize(sticker: any) {
  //   let stickerProp = {'height':'100%', 'width':'auto'};
  //   let width = sticker.width;
  //   let height= sticker.height;
  //   if (width/height < 1) {
  //     stickerProp.width = '100%';
  //     stickerProp.height = 'auto';
  //   } else {
  //     stickerProp.width = 'auto';
  //     stickerProp.height = '100%';
  //   }
  //   return stickerProp;
  // }

  // checkUpload() {
  //   if (this.dpUpload) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  // onAddClick(event) {
  //   this.changedDP = true;
  //   this.dpInput.nativeElement.click();
  // }

  // patchDisplayPicture() {
  //   if (this.changedDP) {
  //     let dpid = this.profile.displayPicture.dpid;
  //     this.profileDataService.deleteDisplayPicture(dpid).subscribe(response => {
  //       this.profileDataService.addDisplayPicture(this.profile.displayPicture,this.uid).subscribe(response => {
  //         this.profileService.updateDisplayPicture(this.uid, this.profile.displayPicture);
  //         this.finishUp()
  //       }, errorMessage => {
  //         console.log(errorMessage);
  //         this.handleError();
  //       });
  //     },errorMessage => {
  //       console.log(errorMessage);
  //       this.handleError();
  //     });
  //   } else {
  //     this.finishUp();
  //   }
  // }

  // patchProfileDetails() {
  //   if (this.changedBio) {
  //     let prid = this.profileService.getPRIDfromUID(this.uid);
  //     this.profileDataService.deleteProfileDetails(prid).subscribe(response => {
  //       this.profileDataService.addProfileDetails(this.profile.profileDetails, this.uid).subscribe(response => {
  //         this.profileService.updateProfileDetails(this.uid, this.profile.profileDetails);
  //         this.profileService.updateMapUIDtoPRID(this.uid, response['name']);
  //         this.patchDisplayPicture();
  //       }, errorMessage => {
  //         console.log(errorMessage);
  //         this.handleError();
  //       });
  //     }, errorMessage => {
  //       console.log(errorMessage);
  //       this.handleError();
  //     });
  //   } else {
  //     this.patchDisplayPicture();
  //   }
  // }

  // addProfileStickers() {
  //   this.profile.profileStickers.stickers.forEach(sticker => {
  //     this.profileDataService.addProfileSticker(sticker, this.uid).subscribe(response =>{
  //     }, errorMessage => {
  //       console.log(errorMessage);
  //       this.handleError();
  //     });
  //   })
  //   this.profileService.updateProfileStickers(this.uid, this.profile.profileStickers);
  //   this.patchProfileDetails();
  // }

  // onSubmit(f) {
  //   if (!this.isSaving) {
  //     if (this.title && this.title.length > 15) {
  //       return;
  //     }
  //     if (this.location && this.location.length > 15) {
  //       return;
  //     }
  //     if (this.content && this.content.length > 90) {
  //       return;
  //     }

  //     if (this.profile.profileStickers.stickers.length > 5) {
  //       for (let i=0; i <= this.profile.profileStickers.stickers.length; i++) {
  //         this.profile.profileStickers.stickers.pop();
  //        }
  //     }

  //     this.isSaving = true;

  //     this.profile.profileDetails.bio.title = this.title;
  //     this.profile.profileDetails.bio.content = this.content;
  //     this.profile.profileDetails.bio.location = this.location;

  //     if (this.lastTitle != this.title || this.lastLocation != this.location || this.lastContent != this.content) {
  //       this.changedBio = true;
  //     }

  //     if (this.changedProfileStickers) {
  //       this.profileDataService.fetchProfileStickers(this.uid).subscribe(response => {
  //         response.forEach(sticker => {
  //           this.profileDataService.deleteProfileStickers(sticker).subscribe(response => {}, errorMessage => {this.handleError();});
  //         });
  //       });
  //           this.addProfileStickers();
  //     } else {
  //       this.patchProfileDetails();
  //     }
  //   }
  // }

  // finishUp() {
  //   this.isSaving = false;
  //   alert('Profile updated!');
  //   this.router.navigate(['/profile/'+this.uid]);
  // }

  // handleError() {
  //   alert("An error occurred! It is what it is...");
  //   this.isSaving = false;
  // }

  ngOnDestroy() {
    // if (this.subProfileDetails) {this.subProfileDetails.unsubscribe();}
    // if (this.subProfileStickers) {this.subProfileStickers.unsubscribe();}
    // if (this.subPostDetails) {this.subPostDetails.unsubscribe();}
    // if (this.subStickerContent) {this.subStickerContent.unsubscribe();}
    // if (this.subDisplayPicture) {this.subDisplayPicture.unsubscribe();}
  }
}
