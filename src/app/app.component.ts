import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { LinksService, Link } from './links.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private svc = inject(LinksService);

  urlInput = '';
  links    = signal<Link[]>([]);
  busy     = signal(false);
  error    = signal('');
  result   = signal<Link | null>(null);

  ngOnInit() { this.refresh(); }

  private refresh() {
    this.svc.getAll().subscribe({ next: l => this.links.set(l) });
  }

  submit() {
    const url = this.urlInput.trim();
    if (!isHttpUrl(url)) {
      this.error.set('Enter a valid http or https URL.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.result.set(null);

    this.svc.create(url).subscribe({
      next: link => {
        this.result.set(link);
        this.urlInput = '';
        this.busy.set(false);
        this.refresh();
      },
      error: (e: HttpErrorResponse) => {
        this.error.set(e.error?.error ?? 'Network error – is the backend running?');
        this.busy.set(false);
      },
    });
  }
}

function isHttpUrl(s: string): boolean {
  try {
    const { protocol } = new URL(s);
    return protocol === 'http:' || protocol === 'https:';
  } catch { return false; }
}
