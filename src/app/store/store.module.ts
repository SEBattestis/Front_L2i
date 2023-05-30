import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { environmentDev as env } from '@env/environment.dev';
import { AppState } from './app.state';
import { CartState } from './cart';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot([AppState, CartState], {
      developmentMode: !env.production,
    }),
    NgxsLoggerPluginModule.forRoot({
      logger: console,
      collapsed: false,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({ key: ['cart'] }),
  ],
})
export class NgxsStoreModule {}
