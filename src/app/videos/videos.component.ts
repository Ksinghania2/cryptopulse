import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface Video { id: string; title: string; channel: string; thumbnail: string; }

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="head"><h1>Crypto Videos</h1><button class="refresh" (click)="load()">Refresh</button></div>
      <div class="grid">
        <div class="card" *ngFor="let v of videos" (click)="play(v)">
          <div class="thumb"><img [src]="v.thumbnail" [alt]="v.title" loading="lazy" (error)="onErr($event)"/><span class="play">▶</span></div>
          <div class="info"><div class="title">{{v.title}}</div><div class="meta">{{v.channel}}</div></div>
        </div>
        <ng-container *ngIf="loading"><div class="skel" *ngFor="let i of [1,2,3,4,5,6]"></div></ng-container>
      </div>
      <div *ngIf="!videos.length && !loading" class="empty">No videos. Click refresh.</div>
      <div class="modal" *ngIf="current" (click)="current=null">
        <div class="box" (click)="$event.stopPropagation()">
          <button class="close" (click)="current=null">✕</button>
          <iframe [src]="embed(current.id)" frameborder="0" allowfullscreen allow="autoplay;encrypted-media"></iframe>
          <div class="mt">{{current.title}}</div><div class="mc">{{current.channel}}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`.page{padding:24px;color:#eaecef}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}h1{margin:0}.refresh{background:#3772ff;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-weight:600}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}.card{background:#151a21;border-radius:12px;overflow:hidden;border:1px solid #2b3139;cursor:pointer;transition:transform .15s,border-color .15s}.card:hover{transform:translateY(-4px);border-color:#3772ff}.thumb{position:relative;aspect-ratio:16/9;background:#0b0e11;overflow:hidden}.thumb img{width:100%;height:100%;object-fit:cover}.play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:40px;color:#fff;background:rgba(0,0,0,.35);opacity:0;transition:opacity .2s}.card:hover .play{opacity:1}.info{padding:12px}.title{font-weight:600;margin-bottom:4px;line-height:1.3}.meta{font-size:12px;color:#848e9c}.skel{height:220px;background:linear-gradient(90deg,#1e2329 25%,#2b3139 50%,#1e2329 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:12px}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}.empty{color:#848e9c;padding:40px;text-align:center}.modal{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px}.box{background:#151a21;border-radius:12px;width:100%;max-width:900px;position:relative;padding:12px}.box iframe{width:100%;aspect-ratio:16/9;border:0;border-radius:8px}.close{position:absolute;top:8px;right:12px;background:transparent;border:none;color:#eaecef;font-size:20px;cursor:pointer}.mt{font-weight:700;margin-top:10px}.mc{font-size:12px;color:#848e9c}`]
})
export class VideosComponent implements OnInit {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  videos: Video[] = [];
  loading = true;
  current: Video | null = null;
  ngOnInit() { this.load(); timer(120000, 120000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.load()); }
  load() {
    this.loading = true;
    this.http.get<Video[]>(`${environment.javaUrl}/videos`).subscribe({
      next: (d) => { this.videos = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
  play(v: Video) { this.current = v; }
  embed(id: string) { return `https://www.youtube.com/embed/${id}?autoplay=1`; }
  onErr(e: any) { e.target.src = 'https://via.placeholder.com/480x270/151a21/848e9c?text=Video'; }
}