import { Team } from './../models/Team';
import { Login } from './../models/Login';
import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private userPayload: BehaviorSubject<any>;
  public currentUserValue: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('Payload_Token'))
    );
    console.log(this.userPayload);
    this.currentUserValue = this.userPayload.asObservable();
  }

  ngOnInit() {}

  get userPayloadValue(): any {
    return this.userPayload.value;
  }

  signUp(user: User) {
    return this.http
      .post<any>(`${environment.baseUrl}/auth/signup`, user)
      .subscribe(
        (success) => {
          Swal.fire('Terimakasih sudah mendaftar');
        },
        (err) => {
          Swal.fire(
            'Maaf ada yang salah dengan proses registrasi',
            err.error.message,
            'error'
          );
        }
      );
  }

  signUpAdmin(user: User) {
    return this.http
      .post<any>(`${environment.baseUrl}/admin/signup`, user)
      .subscribe(
        (success) => {
          console.log(success);
          Swal.fire('Terimakasih sudah mendaftar sebagai admin');
        },
        (err) => {
          console.log(err);
          Swal.fire(
            'Maaf ada yang salah dengan proses registrasi',
            err.error.message,
            'error'
          );
        }
      );
  }

  signIn(login: Login) {
    return this.http
      .post<any>(`${environment.baseUrl}/auth/signin`, login)
      .subscribe(
        (success) => {
          localStorage.setItem('Token', success.access_token);
          localStorage.setItem('Payload_Token', JSON.stringify(success));
          this.userPayload.next(success);
          if (success.roles[0] === 'admin') {
            this.router.navigate(['/home']);
          } else if (success.roles[0] === 'peserta') {
            this.router.navigate(['/pesertaLayout/peserta']);
          } else if (success.roles[0] === 'lurah') {
            this.router.navigate(['/lurahLayout/lurah']);
          } else if (success.roles[0] === 'panitia') {
            this.router.navigate(['/panitiaLayout/panitia']);
          }
          Swal.fire('Anda sudah login');
        },
        (err) => {
          Swal.fire('Maaf ada yang salah dengan proses login anda');
        }
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('Payload_Token');
  }

  updatePesertaProfile(user: User) {
    return this.http
      .put<any>(`${environment.baseUrl}/peserta/update/${user._id}`, user)
      .subscribe((res: any) => {
        Swal.fire('Berhasil memperbarui profil');
      });
  }

  updateAdminProfile(user: User) {
    return this.http
      .put<any>(`${environment.baseUrl}/admin/update/${user._id}`, user)
      .subscribe((res: any) => {
        Swal.fire('Berhasil memperbarui profil');
      });
  }

  getPesertarProfile(user: User): Observable<any> {
    let endpoint = environment.baseUrl + '/peserta' + '/get/' + `${user._id}`;
    return this.http.get(endpoint, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      })
    );
  }

  getAdminProfile(_id): Observable<any> {
    let endpoint = environment.baseUrl + '/admin' + '/get/' + `${_id}`;
    return this.http.get(endpoint, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      })
    );
  }

  createTeam(team: Team) {
    return this.http
      .post(`${environment.baseUrl}/peserta/create-team`, team, {
        headers: this.headers,
      })
      .subscribe((res: any) => {
        alert('Berhasil membuat tim!');
        localStorage.setItem('teamId', res._id);
        // this.getTeam().subscribe((res:any)=>{
        //   console.log(res);
        // })
      });
  }

  getUsers() {
    let endpoint = environment.baseUrl + 'admin/data-user';
    return this.http.get(endpoint, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      })
    );
  }

  getUserProfile(_id): Observable<any> {
    let endpoint = environment.baseUrl + '/peserta' + '/get/' + `${_id}`;
    return this.http.get(endpoint, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      })
    );
  }

  public getAllUser(): Observable<any> {
    return this.http
      .get<any>(`${environment.baseUrl}/admin/data-user`)
      .pipe(map(this.respondGetAllUser));
  }

  private respondGetAllUser(response: any) {
    return response.user;
  }

  createLurah(user: User) {
    return this.http
      .post<any>(`${environment.baseUrl}/admin/create-lurah`, user)
      .subscribe(
        (success) => {
          Swal.fire('Berhasil membuat', success);
        },
        (err) => {
          Swal.fire(
            'Maaf anda tidak berhasil membuat lurah',
            err.error.message,
            'error'
          );
        }
      );
  }
}
