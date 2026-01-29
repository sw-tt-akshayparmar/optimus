import { Injectable } from '@angular/core';

import Constants from '../constants/constants';

@Injectable({ providedIn: 'root' })
export class Utils {
  page(page?: number, size?: number) {
    page = page && page >= 1 ? page : Constants.PAGINATION_DEFAULT_PAGE;
    size =
      size && size >= 1 && size <= Constants.PAGINATION_MAX_SIZE
        ? size
        : Constants.PAGINATION_DEFAULT_SIZE;
    return { page, size };
  }
}
