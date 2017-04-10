import { NgModule }                    from '@angular/core';
import { BrowserModule, Title }        from '@angular/platform-browser';
// import { HttpModule }                  from '@angular/http';
// import { RouterModule }                from '@angular/router';
// import { FormsModule }                 from '@angular/forms';

import { AppRootComponent }            from 'app-root.component';


@NgModule({
    imports: [
        BrowserModule,
        // HttpModule,
        // RouterModule.forRoot(appRoutes),
        // FormsModule,
    ],
    providers: [
        Title,
    ],
    declarations: [
        AppRootComponent,
    ],
    bootstrap: [
        AppRootComponent,
    ],
})
export class AppModule {}
