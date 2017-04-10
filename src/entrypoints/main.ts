import 'zone.js/dist/zone';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app.module';

declare var buildEnv: boolean;
if ( buildEnv ) {
    enableProdMode();
}
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
