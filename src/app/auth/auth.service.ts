import { MixpanelService } from './../shared/mixpanel.service';
import { environment } from './../../environments/environment';
import { ProfileDetails, PersonalDetails, DisplayPicture, Credential } from './../shared/profile.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { first } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/firestore'
import { Collection } from '../shared/activity.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router,
              private afs: AngularFirestore,
              private auth: AngularFireAuth,
              private fns: AngularFireFunctions,
              private mixpanelService: MixpanelService) {}

  async signUp(email: string, password: string) {
    let message = 'success';
    await this.auth.setPersistence('local');
    await this.auth.createUserWithEmailAndPassword(email, password)
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage, errorCode);
      message = this.FirebaseErrors(errorCode);
    });
    return message
  }

  async logIn(email: string, password: string) {
    let message = 'success';
    await this.auth.setPersistence('local');
    await this.auth.signInWithEmailAndPassword(email, password)
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      message = this.FirebaseErrors(errorCode);
    });
    return message
  }

  logout(redirect: boolean = true) {
    this.auth.signOut().then(() => {
      if (redirect) this.router.navigate(['/auth']);
    }).catch((error) => {
      console.log(error);
    });
  }

  async forgotPassword(email: string) {
    let message = 'success';
    await this.auth.sendPasswordResetEmail(email)
    .then(() => console.log("password reset email sent"))
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      message = this.FirebaseErrors(errorCode);
    });
    return message
  }

  private FirebaseErrors (errorCode: string): string {

    let message: string;

    switch (errorCode) {
      case 'auth/wrong-password':
        message = 'Invalid email or password';
        break;
      case 'auth/network-request-failed':
        message = 'Please check your internet connection';
        break;
      case 'auth/too-many-requests':
        message =
          'We have detected too many requests from your device. Take a break please!';
        break;
      case 'auth/user-disabled':
        message =
          'Your account has been disabled or deleted. Please contact the system administrator.';
        break;
      case 'auth/requires-recent-login':
        message = 'Please login again and try again!';
        break;
      case 'auth/email-already-exists':
        message = 'Email address is already in use';
        break;
      case 'auth/email-already-in-use':
        message = 'Email address is already in use';
        break;
      case 'auth/user-not-found':
        message =
          'Email does not exist';
        break;
      case 'auth/phone-number-already-exists':
        message = 'The phone number is already in use by an existing user.';
        break;
      case 'auth/invalid-phone-number':
        message = 'The phone number is not a valid phone number!';
        break;
      case 'auth/invalid-email':
        message = 'The email address is not valid!';
        break;
      case 'auth/cannot-delete-own-user-account':
        message = 'You cannot delete your own user account.';
        break;
        default:
        message = 'Oops! Something went wrong. Try again later.';
        break;
    }

    console.log(errorCode, message);
    return message;
  }

  async newUser(uid: string,
                username: string,
                credential: Credential,
                profileDetails: ProfileDetails,
                personalDetails: PersonalDetails,
                displayPicture: DisplayPicture,
                exclusiveId: string,
                exclusiveObj: any): Promise<boolean> {

    var success: boolean = true;

    const batch = this.afs.firestore.batch();

    const usernameDoc = this.afs.firestore.doc('username/'+uid);
    const credentialDoc = this.afs.firestore.doc('credential/'+username);
    const profileDetailsDoc = this.afs.firestore.doc('profile details/'+uid);
    const personalDetailsDoc = this.afs.firestore.doc('personal details/'+uid);
    const profileStickersDoc = this.afs.firestore.doc('profile stickers/'+uid);
    const displayPictureDoc= this.afs.firestore.doc('display picture/'+uid);
    const activityPrivateDoc = this.afs.firestore.doc('activity/'+uid+'/private/details');
    const activityCollectedDoc = this.afs.firestore.doc('activity/'+uid+'/metrics/collected');
    const activityViewsDoc = this.afs.firestore.doc('activity/'+uid+'/metrics/views');

    //Exclusive users
    const exclusiveIdDoc = this.afs.firestore.doc('exclusive ID/'+exclusiveId);
    const exclusiveUserDoc = this.afs.firestore.doc('exclusive ID/'+exclusiveId+'/users/'+uid);

    const dp = {name: uid, ...displayPicture};
    const metrics = {counter: 0};

    batch.set(usernameDoc, {username: username});
    batch.set(credentialDoc, {...credential});
    batch.set(profileDetailsDoc, {...profileDetails});
    batch.set(personalDetailsDoc, {...personalDetails});
    batch.set(profileStickersDoc, { stickers: ['empty','empty','empty','empty','empty'] });
    batch.set(displayPictureDoc, dp);
    batch.set(activityPrivateDoc, {id: uid, type: 'user'});
    batch.set(activityCollectedDoc, metrics);
    batch.set(activityViewsDoc, metrics);
    batch.set(exclusiveUserDoc, exclusiveObj);
    batch.update(exclusiveIdDoc, {used: firebase.firestore.FieldValue.increment(1)});

    //Alpha sticker collection
    const collection: Collection = new Collection(uid,
                                                  environment.onBoardingUid,
                                                  environment.onBoardingPid,
                                                  new Date().getTime());

    const cid = this.afs.createId();

    //Add collection
    batch.set(this.afs.firestore.doc('collection/'+cid), {...collection});

    //Add holder and user collection
    const collectionObj = {cid: cid, timeStamp: collection.timeStamp, creatorID: collection.collecteeID};

    batch.set(this.afs.firestore.doc('feed/'+ collection.collectorID + '/collection/' + collection.pid), collectionObj);
    batch.set(this.afs.firestore.doc('posts/'+ collection.pid + '/holders/' + collection.collectorID), collectionObj);

    //Update Activity
    batch.update(this.afs.firestore.doc('activity/'+ collection.collecteeID + '/metrics/collected'),
                  {counter: firebase.firestore.FieldValue.increment(1),
                    cid: cid}); //user
    batch.update(this.afs.firestore.doc('activity/'+ collection.pid + '/metrics/collected'),
                  {counter: firebase.firestore.FieldValue.increment(1),
                    cid: cid}); //post

    await batch.commit()
          .then(async () => {
            const currentUser = await this.auth.currentUser;
            console.log("signed up successful", currentUser);
            this.mixpanelService.signUp(uid, {exclusiveId: exclusiveId});
            // currentUser.sendEmailVerification() //send verification email
            // console.log('verification email sent'));
          })
          .catch(async (e) => {
            console.log(e);
            console.log('deleting user');
            const callable = this.fns.httpsCallable('deleteUser'); //delete user from authentication incase of failure
            const data$ = await callable({uid: uid}).pipe(first()).toPromise();
            this.logout(false);
            success =  false;
          });

    return success;
  }
}
