import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Link {
  code: string;
  url: string;
  shortUrl: string;
  hits: number;
  createdAt: string;
}

const API = 'http://localhost:3000/api/links';

@Injectable({ providedIn: 'root' })
export class LinksService {
  private http = inject(HttpClient);

  create(url: string) {
    return this.http.post<Link>(API, { url });
  }

  getAll() {
    return this.http.get<Link[]>(API);
  }
}
