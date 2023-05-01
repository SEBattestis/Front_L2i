import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { MeiliSearchService } from '@s/meilisearch.service';
import { SearchFocusService } from '@s/searchFocus.service';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css'],
})
export class SearchItemComponent implements OnDestroy, OnInit {
  searchInput = new FormControl('');
  @ViewChild('searchInputElement') searchInputElement!: ElementRef;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly meiliSearchService: MeiliSearchService,
    private router: Router,
    private searchFocusService: SearchFocusService
  ) {}

  ngOnInit(): void {
    this.subscribeToFocusEvents();

    this.searchInput.valueChanges
      .pipe(debounceTime(11), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.search(query);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToFocusEvents(): void {
    this.searchFocusService.focusSearchInput$
      .pipe(takeUntil(this.destroy$))
      .subscribe((shouldFocus) => {
        if (shouldFocus) {
          this.focusSearchInput();
          this.searchFocusService.resetFocusTrigger();
        }
      });
  }

  search(query: string): void {
    this.meiliSearchService.updatedSearch(query).subscribe((results) => {
      this.meiliSearchService.setSearchValue(query);
      this.router
        .navigate(['/items'], { queryParams: { q: query } })
        .then(() => {
          this.searchFocusService.triggerFocus();
        });
    });
  }

  resetSearchInput(): void {
    this.searchInput.setValue('');
  }

  focusSearchInput(): void {
    setTimeout(() => {
      this.searchInputElement.nativeElement.focus();
    }, 0);
  }
}
